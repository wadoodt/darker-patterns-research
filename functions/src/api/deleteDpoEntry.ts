import * as admin from 'firebase-admin';
import type { Timestamp as FirebaseAdminTimestamp } from 'firebase-admin/firestore';
import * as functions from 'firebase-functions/v2';
import { onCall, HttpsError } from 'firebase-functions/v2/https';
import type { ActivityLogItemFc, AdminSettingsData, DPOEntry } from '../types';

if (admin.apps.length === 0) {
  admin.initializeApp();
}
const db = admin.firestore();

export const deleteDpoEntry = onCall(async (request) => {
  // 1. Authentication/Authorization
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'The function must be called while authenticated.');
  }
  const auth = request.auth;

  const user = await admin.auth().getUser(auth.uid);
  if (user.customClaims?.role !== 'admin') {
    throw new HttpsError('permission-denied', 'The function must be called by an admin.');
  }

  const { entryId } = request.data;
  if (!entryId || typeof entryId !== 'string') {
    throw new HttpsError('invalid-argument', 'The function must be called with a valid "entryId".');
  }

  const entryRef = db.doc(`dpo_entries/${entryId}`);
  const evaluationsRef = db.collection('evaluations').where('dpoEntryId', '==', entryId);
  const flagsRef = db.collection(`dpo_entries/${entryId}/participant_flags`);
  const overviewStatsRef = db.doc('cached_statistics/overview_stats');

  try {
    await db.runTransaction(async (transaction) => {
      const entryDoc = await transaction.get(entryRef);
      if (!entryDoc.exists) {
        throw new HttpsError('not-found', `DPO entry with ID ${entryId} not found.`);
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

      // 3. Update Statistics
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
    if (error instanceof HttpsError) {
      throw error;
    }
    throw new HttpsError('internal', 'An unexpected error occurred while deleting the entry.');
  }
});
