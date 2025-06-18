import * as admin from 'firebase-admin';
import type { Timestamp as FirebaseAdminTimestamp } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';
import * as functions from 'firebase-functions/v2';
import { onDocumentCreated, onDocumentWritten } from 'firebase-functions/v2/firestore';
import { DpoEntryData, ingestDpoDatasetSchema } from './schemas/dpo_entry';
import { processEntryDetails } from './entry-details';
import type {
  ActivityLogItemFc,
  AdminSettingsData,
  DemographicData,
  DPOEntry,
  EvaluationData,
  ParticipantFlag,
  ParticipantSession,
} from './types';

if (admin.apps.length === 0) {
  admin.initializeApp();
}
const db = admin.firestore();

// --- Function to update overview_stats on new evaluation ---
export const onNewEvaluationUpdateStats = onDocumentCreated('evaluations/{evaluationId}', async (event) => {
  const snap = event.data;
  const context = { params: event.params };
  const evaluationData = snap?.data() as EvaluationData | undefined;
  if (!evaluationData) {
    functions.logger.error('No data in new evaluation snapshot.', {
      evaluationId: context.params.evaluationId,
    });
    return null;
  }

  const overviewStatsRef = db.doc('cached_statistics/overview_stats');
  const dpoEntryRef = db.doc(`dpo_entries/${evaluationData.dpoEntryId}`);
  const adminSettingsRef = db.doc('admin_settings/global_config');
  const responseAggregatesRef = db.doc('cached_statistics/response_aggregates');

  try {
    return await db.runTransaction(async (transaction) => {
      const overviewStatsDoc = await transaction.get(overviewStatsRef);
      const dpoEntryDoc = await transaction.get(dpoEntryRef);
      const adminSettingsDoc = await transaction.get(adminSettingsRef);
      const responseAggregatesDoc = await transaction.get(responseAggregatesRef);

      const currentOverviewStats = overviewStatsDoc.data() || {};
      const currentResponseAggregates = responseAggregatesDoc.data() || {};

      let totalEvals = (currentOverviewStats.totalEvaluationsSubmitted || 0) + 1;
      let currentAvgTime = currentOverviewStats.averageTimePerEvaluationMs || 0;
      let evalCountForAvg = currentOverviewStats.evaluationsCountForAvg || 0;
      let currentFullyReviewedCount = currentOverviewStats.fullyReviewedEntriesCount || 0;
      let totalAgreementCount = currentOverviewStats.totalAgreementCount || 0;

      const newTimeSpent = evaluationData.timeSpentMs || 0;
      currentAvgTime = (currentAvgTime * evalCountForAvg + newTimeSpent) / (evalCountForAvg + 1);
      evalCountForAvg += 1;

      if (dpoEntryDoc.exists) {
        const entryData = dpoEntryDoc.data() as DPOEntry | undefined;
        const adminSettings = adminSettingsDoc.data() as AdminSettingsData | undefined;
        const actualReviewCount = (entryData?.reviewCount || 0) + 1;
        const targetReviews = adminSettings?.minTargetReviewsPerEntry || 10;

        if (
          actualReviewCount === targetReviews &&
          (entryData?.previousReviewCountForFullyReviewedCheck || 0) < targetReviews
        ) {
          currentFullyReviewedCount = (currentFullyReviewedCount < 0 ? 0 : currentFullyReviewedCount) + 1;
          transaction.update(dpoEntryRef, { previousReviewCountForFullyReviewedCheck: targetReviews });
        } else if (
          actualReviewCount > targetReviews &&
          (entryData?.previousReviewCountForFullyReviewedCheck || 0) < targetReviews
        ) {
          currentFullyReviewedCount = (currentFullyReviewedCount < 0 ? 0 : currentFullyReviewedCount) + 1;
          transaction.update(dpoEntryRef, { previousReviewCountForFullyReviewedCheck: targetReviews });
        }
      } else {
        functions.logger.warn(`DPO entry ${evaluationData.dpoEntryId} not found while updating stats.`, {
          evaluationId: context.params.evaluationId,
        });
      }

      if (evaluationData.wasChosenActuallyAccepted) {
        totalAgreementCount += 1;
      }
      const newAgreementRate = totalEvals > 0 ? (totalAgreementCount / totalEvals) * 100 : 0;

      transaction.set(
        overviewStatsRef,
        {
          totalEvaluationsSubmitted: totalEvals,
          fullyReviewedEntriesCount: currentFullyReviewedCount,
          averageTimePerEvaluationMs: Math.round(currentAvgTime),
          evaluationsCountForAvg: evalCountForAvg,
          totalAgreementCount: totalAgreementCount,
          agreementRate: parseFloat(newAgreementRate.toFixed(1)),
          lastEvaluationAt: evaluationData.submittedAt || admin.firestore.FieldValue.serverTimestamp(),
          lastUpdatedAt: admin.firestore.FieldValue.serverTimestamp() as FirebaseAdminTimestamp,
        },
        { merge: true },
      );

      const ratingKey = `${evaluationData.rating}_star` as keyof NonNullable<
        typeof currentResponseAggregates.ratingDistribution
      >;
      const newRatingDistribution = {
        ...(currentResponseAggregates.ratingDistribution || {}),
        [ratingKey]: (currentResponseAggregates.ratingDistribution?.[ratingKey] || 0) + 1,
      };

      let commentSubmissions = currentResponseAggregates.commentSubmissions || 0;
      if (evaluationData.comment && evaluationData.comment.trim() !== '') {
        commentSubmissions += 1;
      }
      const newCommentRate = totalEvals > 0 ? (commentSubmissions / totalEvals) * 100 : 0;

      transaction.set(
        responseAggregatesRef,
        {
          ratingDistribution: newRatingDistribution,
          commentSubmissions: commentSubmissions,
          commentSubmissionRatePercent: parseFloat(newCommentRate.toFixed(1)),
          lastUpdatedAt: admin.firestore.FieldValue.serverTimestamp() as FirebaseAdminTimestamp,
        },
        { merge: true },
      );

      return null;
    });
  } catch (error) {
    functions.logger.error('Transaction failure onNewEvaluationUpdateStats:', error, {
      evaluationId: context.params.evaluationId,
    });
    return null;
  }
});

const updateIncrement = (obj: Record<string, number> | undefined, key: string): Record<string, number> => {
  const currentObj = obj || {};
  return {
    ...currentObj,
    [key]: (currentObj[key] || 0) + 1,
  };
};

export const onNewParticipantUpdateDemographics = onDocumentCreated(
  'survey_participants/{participantId}',
  async (event) => {
    const snap = event.data;
    const context = { params: event.params };
    const participantData = snap?.data() as ParticipantSession | undefined;
    const demographics = participantData?.demographics as DemographicData | undefined;

    if (!demographics || Object.keys(demographics).length === 0) {
      functions.logger.info('No demographics data to update for participant.', {
        participantId: context.params.participantId,
      });
      return null;
    }
    const summaryRef = db.doc('cached_statistics/demographics_summary');

    try {
      return await db.runTransaction(async (transaction) => {
        const summaryDoc = await transaction.get(summaryRef);
        const currentSummary = summaryDoc.data() || {};

        const newSummaryData: any = {
          totalParticipantsWithDemographics: (currentSummary.totalParticipantsWithDemographics || 0) + 1,
          lastUpdatedAt: admin.firestore.FieldValue.serverTimestamp() as FirebaseAdminTimestamp,
        };

        if (demographics.ageGroup)
          newSummaryData.ageGroupDistribution = updateIncrement(
            currentSummary.ageGroupDistribution,
            demographics.ageGroup,
          );
        if (demographics.gender)
          newSummaryData.genderDistribution = updateIncrement(currentSummary.genderDistribution, demographics.gender);
        if (demographics.educationLevel)
          newSummaryData.educationDistribution = updateIncrement(
            currentSummary.educationDistribution,
            demographics.educationLevel,
          );
        if (demographics.fieldOfExpertise)
          newSummaryData.expertiseDistribution = updateIncrement(
            currentSummary.expertiseDistribution,
            demographics.fieldOfExpertise,
          );
        if (demographics.aiFamiliarity)
          newSummaryData.aiFamiliarityDistribution = updateIncrement(
            currentSummary.aiFamiliarityDistribution,
            demographics.aiFamiliarity,
          );

        transaction.set(summaryRef, newSummaryData, { merge: true });
        return null;
      });
    } catch (error) {
      functions.logger.error('Transaction failure onNewParticipantUpdateDemographics:', error, {
        participantId: context.params.participantId,
      });
      return null;
    }
  },
);

export const deleteDpoEntry = functions.https.onCall(async (request) => {
  // 1. Authentication/Authorization
  if (!request.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'The function must be called while authenticated.');
  }
  const auth = request.auth;

  const user = await admin.auth().getUser(auth.uid);
  if (user.customClaims?.role !== 'admin') {
    throw new functions.https.HttpsError('permission-denied', 'The function must be called by an admin.');
  }

  const { entryId } = request.data;
  if (!entryId || typeof entryId !== 'string') {
    throw new functions.https.HttpsError('invalid-argument', 'The function must be called with a valid "entryId".');
  }

  const entryRef = db.doc(`dpo_entries/${entryId}`);
  const evaluationsRef = db.collection('evaluations').where('dpoEntryId', '==', entryId);
  const flagsRef = db.collection(`dpo_entries/${entryId}/participant_flags`);
  const overviewStatsRef = db.doc('cached_statistics/overview_stats');

  try {
    await db.runTransaction(async (transaction) => {
      const entryDoc = await transaction.get(entryRef);
      if (!entryDoc.exists) {
        throw new functions.https.HttpsError('not-found', `DPO entry with ID ${entryId} not found.`);
      }

      const entryData = entryDoc.data() as DPOEntry;

      // 2. Cascade Deletion
      const evaluationsSnapshot = await evaluationsRef.get();
      evaluationsSnapshot.forEach((doc) => {
        transaction.delete(doc.ref);
      });

      const flagsSnapshot = await flagsRef.get();
      flagsSnapshot.forEach((doc) => {
        transaction.delete(doc.ref);
      });

      transaction.delete(entryRef);

      // 3. Update Aggregates
      const overviewStatsDoc = await transaction.get(overviewStatsRef);
      const currentOverviewStats = overviewStatsDoc.data() || {};
      const totalEntriesInDataset = (currentOverviewStats.totalEntriesInDataset || 1) - 1;
      let fullyReviewedEntriesCount = currentOverviewStats.fullyReviewedEntriesCount || 0;

      const adminSettingsRef = db.doc('admin_settings/global_config');
      const adminSettingsDoc = await transaction.get(adminSettingsRef);
      const adminSettings = adminSettingsDoc.data() as AdminSettingsData | undefined;
      const targetReviews = adminSettings?.minTargetReviewsPerEntry || 10;

      if (entryData.reviewCount >= targetReviews) {
        fullyReviewedEntriesCount = (fullyReviewedEntriesCount > 0 ? fullyReviewedEntriesCount : 1) - 1;
      }

      transaction.update(overviewStatsRef, {
        totalEntriesInDataset,
        fullyReviewedEntriesCount,
      });

      // 4. Logging
      const logRef = db.collection('activity_logs').doc();
      const logData: ActivityLogItemFc = {
        eventType: 'dpo_entry_deleted',
        dpoEntryId: entryId,
        details: {
          deletedBy: auth.uid,
        },
        timestamp: admin.firestore.FieldValue.serverTimestamp() as FirebaseAdminTimestamp,
        displayText: `Admin deleted DPO entry ${entryId}`,
        iconName: 'delete',
      };
      transaction.set(logRef, logData);
    });

    return { success: true, message: `DPO entry ${entryId} and all associated data have been deleted.` };
  } catch (error) {
    functions.logger.error(`Error deleting DPO entry ${entryId}:`, error);
    if (error instanceof functions.https.HttpsError) {
      throw error;
    }
    throw new functions.https.HttpsError('internal', 'An unexpected error occurred while deleting the entry.');
  }
});

export const onParticipantEmailUpdate = onDocumentWritten('survey_participants/{participantId}', async (event) => {
  if (!event.data) return null;
  const beforeData = event.data.before?.data() as ParticipantSession | undefined;
  const afterData = event.data.after?.data() as ParticipantSession | undefined;
  const context = { params: event.params };
  const overviewStatsRef = db.doc('cached_statistics/overview_stats');

  const emailExistsBefore = !!beforeData?.email?.trim() && !!beforeData?.optedInForPaper;
  const emailExistsAfter = !!afterData?.email?.trim() && !!afterData?.optedInForPaper;

  if (emailExistsBefore === emailExistsAfter) return null; // No change in opted-in email status

  try {
    return await db.runTransaction(async (transaction) => {
      const overviewStatsDoc = await transaction.get(overviewStatsRef);
      let count = overviewStatsDoc.data()?.usersWithEmailAddressCount || 0;
      if (emailExistsAfter && !emailExistsBefore) {
        count++;
      } else if (!emailExistsAfter && emailExistsBefore) {
        count = Math.max(0, count - 1);
      }
      transaction.set(
        overviewStatsRef,
        {
          usersWithEmailAddressCount: count,
          lastUpdatedAt: admin.firestore.FieldValue.serverTimestamp() as FirebaseAdminTimestamp,
        },
        { merge: true },
      );
      return null;
    });
  } catch (error) {
    functions.logger.error('Transaction failure onParticipantEmailUpdate:', error, {
      participantId: context.params.participantId,
    });
    return null;
  }
});

export const logNewEvaluationActivity = onDocumentCreated('evaluations/{evaluationId}', async (event) => {
  const snap = event.data;
  const context = { params: event.params };
  const evalData = snap?.data() as EvaluationData | undefined;
  if (!evalData) {
    functions.logger.error('No data in new evaluation snapshot for activity log.', {
      evaluationId: context.params.evaluationId,
    });
    return null;
  }
  const activityLogRef = db.collection('activity_log').doc();
  const displayText = `Evaluation for entry ${evalData.dpoEntryId.substring(0, 6)}... by PUID ${evalData.participantSessionUid.substring(0, 6)}...`;
  const iconName = 'CheckSquare';
  try {
    await activityLogRef.set({
      timestamp: admin.firestore.FieldValue.serverTimestamp() as FirebaseAdminTimestamp,
      eventType: 'evaluation_submitted',
      participantSessionUid: evalData.participantSessionUid,
      dpoEntryId: evalData.dpoEntryId,
      details: {
        rating: evalData.rating,
        chosenOptionKey: evalData.chosenOptionKey,
        wasResearcherAgreement: evalData.wasChosenActuallyAccepted,
      },
      displayText: displayText,
      iconName: iconName,
      actionLink: `/admin/entries/${evalData.dpoEntryId}`,
      actionText: 'View Entry',
    } as ActivityLogItemFc);
    functions.logger.info('Activity logged: evaluation_submitted', {
      evaluationId: context.params.evaluationId,
    });
    return null;
  } catch (error) {
    functions.logger.error('Error logging new evaluation activity:', error, {
      evaluationId: context.params.evaluationId,
    });
    return null;
  }
});

export const logNewParticipantSessionActivity = onDocumentCreated(
  'survey_participants/{participantId}',
  async (event) => {
    const snap = event.data;
    const context = { params: event.params };
    const participantData = snap?.data() as ParticipantSession | undefined;
    if (!participantData) {
      functions.logger.error('No data in new participant session snapshot for activity log.', {
        participantId: context.params.participantId,
      });
      return null;
    }
    const activityLogRef = db.collection('activity_log').doc();
    const displayText = `New participant PUID ${context.params.participantId.substring(0, 6)}... started (${participantData.participationType}).`;
    const iconName = 'UserPlus';
    try {
      await activityLogRef.set({
        timestamp: admin.firestore.FieldValue.serverTimestamp() as FirebaseAdminTimestamp,
        eventType: 'participant_session_started',
        participantSessionUid: context.params.participantId,
        details: {
          participationType: participantData.participationType,
          emailProvided: !!participantData.email,
        },
        displayText: displayText,
        iconName: iconName,
      } as ActivityLogItemFc);
      functions.logger.info('Activity logged: participant_session_started', {
        participantId: context.params.participantId,
      });
      return null;
    } catch (error) {
      functions.logger.error('Error logging new participant session:', error, {
        participantId: context.params.participantId,
      });
      return null;
    }
  },
);

export const logParticipantFlagActivity = onDocumentCreated(
  'dpo_entries/{entryId}/participant_flags/{flagId}',
  async (event) => {
    const snap = event.data;
    const context = { params: event.params };
    const flagData = snap?.data() as ParticipantFlag | undefined;
    if (!flagData) {
      functions.logger.error('No data in new flag snapshot for activity log.', {
        entryId: context.params.entryId,
        flagId: context.params.flagId,
      });
      return null;
    }
    const activityLogRef = db.collection('activity_log').doc();
    const displayText = `Entry ${context.params.entryId.substring(0, 6)}... flagged by PUID ${flagData.participantSessionUid.substring(0, 6)}... Reason: ${flagData.reason.substring(0, 30)}...`;
    const iconName = 'Flag';
    try {
      await activityLogRef.set({
        timestamp: admin.firestore.FieldValue.serverTimestamp() as FirebaseAdminTimestamp,
        eventType: 'participant_flag_submitted',
        participantSessionUid: flagData.participantSessionUid,
        dpoEntryId: context.params.entryId,
        details: {
          reason: flagData.reason,
          commentProvided: !!flagData.comment,
        },
        displayText: displayText,
        iconName: iconName,
        actionLink: `/admin/entries/${context.params.entryId}`,
        actionText: 'Review Flag',
      } as ActivityLogItemFc);
      functions.logger.info('Activity logged: participant_flag_submitted', {
        entryId: context.params.entryId,
        flagId: context.params.flagId,
      });
      return null;
    } catch (error) {
      functions.logger.error('Error logging participant flag activity:', error, {
        entryId: context.params.entryId,
        flagId: context.params.flagId,
      });
      return null;
    }
  },
);

import type { CallableRequest } from 'firebase-functions/v2/https';
import { onCall, HttpsError } from 'firebase-functions/v2/https';

export const exportData = onCall({ region: 'us-central1' }, async (req: CallableRequest<any>) => {
  if (!req.auth || !(req.auth.token as any).admin) {
    functions.logger.warn('Unauthorized export attempt by UID:', req.auth?.uid);
    throw new functions.https.HttpsError('permission-denied', 'User must be an admin to export data.');
  }
  const dataType = req.data.dataType;
  const bucket = getStorage().bucket(); // Default storage bucket
  const timestamp = Date.now();
  let fileContent = '';
  let fileName = '';
  let contentType = '';
  try {
    if (dataType === 'participantEmailsCSV') {
      fileName = `participant_emails_opted_in_${timestamp}.csv`;
      contentType = 'text/csv;charset=utf-8;';
      const participantsSnap = await db
        .collection('survey_participants')
        .where('email', '!=', null)
        .where('optedInForPaper', '==', true)
        .get();
      let csvHeader =
        'Email,OptedInForPaper,SessionUID,SubmittedAt,AgeGroup,Gender,EducationLevel,FieldOfExpertise,AIFamiliarity\n';
      let csvRows = participantsSnap.docs
        .map((docSnap) => {
          const pData = docSnap.data() as ParticipantSession;
          const demo = pData.demographics || {};
          const submittedAtDate =
            (pData.surveyCompletedAt as FirebaseAdminTimestamp)?.toDate() ||
            (pData.createdAt as FirebaseAdminTimestamp)?.toDate();
          const submittedAt = submittedAtDate ? submittedAtDate.toISOString() : 'N/A';
          return (
            `"${pData.email || ''}","${pData.optedInForPaper || false}","${docSnap.id}",` +
            `"${submittedAt}",` +
            `"${demo.ageGroup || ''}","${demo.gender || ''}","${demo.educationLevel || ''}",` +
            `"${demo.fieldOfExpertise || ''}","${demo.aiFamiliarity || ''}"`
          );
        })
        .join('\n');
      fileContent = csvHeader + csvRows;
    } else if (dataType === 'allResponsesJSON') {
      fileName = `all_evaluations_${timestamp}.json`;
      contentType = 'application/json;charset=utf-8;';
      const evaluationsSnap = await db.collection('evaluations').orderBy('submittedAt', 'asc').get();
      const evaluations = evaluationsSnap.docs.map((docSnap) => {
        const evalData = docSnap.data() as EvaluationData;
        const submittedAtDate = (evalData.submittedAt as FirebaseAdminTimestamp)?.toDate();
        const submittedAtISO = submittedAtDate ? submittedAtDate.toISOString() : null;
        return { id: docSnap.id, ...evalData, submittedAt: submittedAtISO };
      });
      fileContent = JSON.stringify(evaluations, null, 2);
    } else {
      throw new functions.https.HttpsError('invalid-argument', 'Invalid dataType specified.');
    }
    const file = bucket.file(`admin_exports/${fileName}`);
    await file.save(Buffer.from(fileContent), { metadata: { contentType } });
    const [url] = await file.getSignedUrl({ action: 'read', expires: Date.now() + 15 * 60 * 1000 });
    functions.logger.info(`Export generated: ${fileName}, URL: ${url.substring(0, 50)}...`, {
      uid: req.auth.uid,
      dataType,
    });
    return { downloadUrl: url };
  } catch (error: any) {
    functions.logger.error(`Error during export for dataType ${dataType}:`, error, { uid: req.auth?.uid });
    if (error instanceof functions.https.HttpsError) throw error;
    throw new functions.https.HttpsError('internal', error.message || 'Failed to generate export file.');
  }
});

// --- Callable function to revise a DPO entry ---
export const reviseDpoEntry = onCall(async (request) => {
  // 1. Authentication & Authorization
  if (!request.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'The function must be called by an authenticated user.');
  }

  const userDoc = await db.collection('users').doc(request.auth.uid).get();
  const userData = userDoc.data();
  if (!userDoc.exists || !Array.isArray(userData?.roles) || !userData?.roles.includes('admin')) {
    throw new functions.https.HttpsError('permission-denied', 'The function must be called by an administrator.');
  }

  // 2. Data Validation
  const { originalEntryId, correctedData } = request.data;
  if (!originalEntryId || !correctedData) {
    throw new functions.https.HttpsError('invalid-argument', 'Missing originalEntryId or correctedData.');
  }

  const originalEntryRef = db.collection('dpo_entries').doc(originalEntryId);
  const newEntryRef = db.collection('dpo_entries').doc(); // Create a new document reference with an auto-generated ID

  try {
    await db.runTransaction(async (transaction) => {
      const originalDoc = await transaction.get(originalEntryRef);
      if (!originalDoc.exists) {
        throw new Error('Original DPO entry not found.');
      }

      // 3. Create New Entry
      const newEntry: DPOEntry = {
        ...correctedData,
        id: newEntryRef.id,
        reviewCount: 0,
        isFlaggedCount: 0,
        createdAt: admin.firestore.FieldValue.serverTimestamp() as FirebaseAdminTimestamp,
        originalEntryId: originalEntryId,
        isArchived: false,
      };
      transaction.set(newEntryRef, newEntry);

      // 4. Archive Original Entry
      transaction.update(originalEntryRef, {
        isArchived: true,
        archivedAt: admin.firestore.FieldValue.serverTimestamp() as FirebaseAdminTimestamp,
        supersededByEntryId: newEntryRef.id,
      });
    });

    // 5. Feedback
    return { success: true, newEntryId: newEntryRef.id, message: 'Entry revised successfully.' };
  } catch (error) {
    functions.logger.error('Error revising DPO entry:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred during revision.';
    throw new functions.https.HttpsError('internal', errorMessage, error);
  }
});

// --- Callable function to ingest a dataset of DPO entries ---
export const ingestDpoDataset = onCall(async (request) => {
  // 1. Authentication & Authorization
  if (!request.auth) {
    // This checks if the user is authenticated at all.
    throw new functions.https.HttpsError('unauthenticated', 'The function must be called by an authenticated user.');
  }

  // Check if the authenticated user is an administrator by reading their Firestore document.
  const userDoc = await db.collection('users').doc(request.auth.uid).get();
  const userData = userDoc.data();
  if (!userDoc.exists || !Array.isArray(userData?.roles) || !userData?.roles.includes('admin')) {
    // The user is authenticated, but not an admin.
    throw new functions.https.HttpsError(
      'permission-denied',
      `The function must be called by an administrator. Current roles for user ${request.auth.uid}: ${userData?.roles}`,
    );
  }

  // 2. Data Validation
  const parseResult = ingestDpoDatasetSchema.safeParse(request.data);
  if (!parseResult.success) {
    const formattedErrors = parseResult.error.errors
      .map((err) => {
        const path = err.path.length > 0 ? ` at path "${err.path.join('.')}"` : '';
        return `- ${err.message}${path}`;
      })
      .join('\n');

    throw new functions.https.HttpsError(
      'invalid-argument',
      'The provided data does not match the expected format. Please check the following issues:',
      {
        errors: parseResult.error.flatten(),
        message: `Validation failed:\n${formattedErrors}`,
      },
    );
  }

  const entries = parseResult.data;

  // 3. Batch Writes to Firestore
  const batch = db.batch();
  const dpoEntriesRef = db.collection('dpo_entries');
  const adminSettingsRef = db.doc('admin_settings/global_config');

  try {
    const adminSettingsDoc = await adminSettingsRef.get();
    const defaultTargetReviewCount = adminSettingsDoc.exists
      ? adminSettingsDoc.data()?.minTargetReviewsPerEntry || 10
      : 10;

    entries.forEach((entryData: DpoEntryData) => {
      const newEntryRef = dpoEntriesRef.doc(); // Auto-generate ID
      const newEntry: DPOEntry = {
        id: newEntryRef.id,
        instruction: entryData.instruction,
        acceptedResponse: entryData.acceptedResponse,
        rejectedResponse: entryData.rejectedResponse,
        categories: entryData.categories,
        prompt: entryData.prompt ?? '',
        discussion: entryData.discussion ?? '',
        reviewCount: 0,
        targetReviewCount: defaultTargetReviewCount,
        createdAt: admin.firestore.FieldValue.serverTimestamp() as FirebaseAdminTimestamp,
        isFlaggedCount: 0,
        isArchived: false,
      };
      batch.set(newEntryRef, newEntry);
    });

    await batch.commit();

    // 4. Feedback
    return { success: true, message: `Successfully ingested ${entries.length} DPO entries.` };
  } catch (error) {
    functions.logger.error('Error ingesting DPO dataset:', error);
    throw new functions.https.HttpsError('internal', 'An error occurred while ingesting the dataset.', error);
  }
});

// --- Callable function to increment view count ---
export const incrementEntryViewCount = onCall(async (request) => {
  const { entryId } = request.data;

  if (!entryId) {
    throw new HttpsError('invalid-argument', 'The function must be called with an "entryId" argument.');
  }

  const entryRef = db.collection('dpo_entries').doc(entryId);

  try {
    await entryRef.update({
      viewCount: admin.firestore.FieldValue.increment(1),
    });
    return { success: true };
  } catch (error) {
    functions.logger.error(`Error incrementing view count for entry ${entryId}:`, error);
    throw new HttpsError('internal', 'An error occurred while updating the view count.');
  }
});

// --- Callable function to export the DPO dataset ---
export const exportDpoDataset = onCall(async (request) => {
  // 1. Authentication & Authorization
  if (!request.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'The function must be called by an authenticated user.');
  }

  const userDoc = await db.collection('users').doc(request.auth.uid).get();
  const userData = userDoc.data();
  if (!userDoc.exists || !Array.isArray(userData?.roles) || !userData?.roles.includes('admin')) {
    throw new functions.https.HttpsError(
      'permission-denied',
      `The function must be called by an administrator. Current roles for user ${request.auth.uid}: ${userData?.roles}`,
    );
  }

  // 2. Input Validation
  const { format = 'json', includeArchived = false } = request.data;
  if (format !== 'json' && format !== 'csv') {
    throw new functions.https.HttpsError('invalid-argument', "The 'format' parameter must be 'json' or 'csv'.");
  }

  try {
    // 3. Data Fetching
    let query: admin.firestore.Query<admin.firestore.DocumentData> = db.collection('dpo_entries');
    if (!includeArchived) {
      query = query.where('isArchived', '!=', true);
    }

    const snapshot = await query.get();
    const dpoEntries = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as DPOEntry[];

    // 4. Data Augmentation & Formatting
    let fileContent: string;
    const augmentedEntries = [];

    for (const entry of dpoEntries) {
      const evaluationsSnapshot = await db.collection('evaluations').where('dpoEntryId', '==', entry.id).get();
      const evaluations = evaluationsSnapshot.docs.map((doc) => doc.data() as EvaluationData);

      const flagsSnapshot = await db.collection('participant_flags').where('dpoEntryId', '==', entry.id).get();
      const flags = flagsSnapshot.docs.map((doc) => doc.data() as ParticipantFlag);

      const processedData = processEntryDetails(entry, evaluations, flags);
      const chosenCount = evaluations.filter((e) => e.chosenOptionKey === 'A').length;

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { analytics, evaluations: processedEvals, ...restOfEntry } = processedData;

      augmentedEntries.push({
        ...restOfEntry,
        evaluationCount: analytics.totalEvaluations,
        chosenOverPairCount: chosenCount,
        agreementRate: parseFloat(analytics.correctness.toFixed(2)),
      });
    }

    if (format === 'json') {
      fileContent = JSON.stringify(augmentedEntries, null, 2);
    } else {
      // CSV format
      if (augmentedEntries.length === 0) {
        fileContent = '';
      } else {
        const headers = Object.keys(augmentedEntries[0]).join(',');
        const rows = augmentedEntries.map((entry: any) => {
          return Object.values(entry)
            .map((value: any) => {
              if (value === null || value === undefined) {
                return '';
              }
              if (typeof value === 'string') {
                return `\"${value.replace(/"/g, '""')}\"`;
              }
              if (Array.isArray(value)) {
                return `\"${value.join(';')}\"`;
              }
              if (typeof value === 'object' && value.hasOwnProperty('_seconds')) {
                return new Date(value._seconds * 1000).toISOString();
              }
              return value;
            })
            .join(',');
        });
        fileContent = `${headers}\n${rows.join('\n')}`;
      }
    }

    // 5. File Generation & Storage
    const bucket = getStorage().bucket();
    const fileName = `admin_exports/datasets/dpo_dataset_augmented_${Date.now()}.${format}`;
    const file = bucket.file(fileName);

    await file.save(fileContent, {
      contentType: format === 'json' ? 'application/json' : 'text/csv',
    });

    // 6. Return Download URL
    const [url] = await file.getSignedUrl({
      action: 'read',
      expires: Date.now() + 1000 * 60 * 15, // 15 minutes
    });

    return { success: true, downloadUrl: url };
  } catch (error) {
    functions.logger.error('Error exporting DPO dataset:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred during export.';
    throw new functions.https.HttpsError('internal', errorMessage, error);
  }
});

// --- Callable function to get full entry details ---
export const getEntryDetails = onCall(async (request) => {
  if (!request.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'The function must be called by an authenticated user.');
  }

  const { entryId } = request.data;
  if (!entryId || typeof entryId !== 'string') {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'The function must be called with a valid "entryId" argument.',
    );
  }

  try {
    const entryRef = db.doc(`dpo_entries/${entryId}`);
    const evaluationsQuery = db.collection('evaluations').where('dpoEntryId', '==', entryId);
    const flagsQuery = db.collection('participant_flags').where('dpoEntryId', '==', entryId);

    const [entryDoc, evaluationsSnapshot, flagsSnapshot] = await Promise.all([
      entryRef.get(),
      evaluationsQuery.get(),
      flagsQuery.get(),
    ]);

    if (!entryDoc.exists) {
      throw new functions.https.HttpsError('not-found', `Entry with ID ${entryId} not found.`);
    }

    const entry = { id: entryDoc.id, ...entryDoc.data() } as DPOEntry;
    const evaluations = evaluationsSnapshot.docs.map((doc) => doc.data() as EvaluationData);
    const flags = flagsSnapshot.docs.map((doc) => doc.data() as ParticipantFlag);

    const entryDetails = processEntryDetails(entry, evaluations, flags);

    // The callable function SDKs automatically serialize Date objects, so no conversion needed here.
    return { entryDetails };
  } catch (error) {
    functions.logger.error(`Error getting entry details for ${entryId}:`, error);
    if (error instanceof (functions.https.HttpsError as any)) {
      throw error;
    }
    throw new functions.https.HttpsError('internal', 'An error occurred while fetching entry details.');
  }
});
