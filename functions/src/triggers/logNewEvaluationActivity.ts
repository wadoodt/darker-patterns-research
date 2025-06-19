import * as admin from 'firebase-admin';
import type { Timestamp as FirebaseAdminTimestamp } from 'firebase-admin/firestore';
import * as functions from 'firebase-functions/v2';
import { onDocumentCreated } from 'firebase-functions/v2/firestore';
import type { ActivityLogItemFc, EvaluationData } from '../types';

if (admin.apps.length === 0) {
  admin.initializeApp();
}
const db = admin.firestore();

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
  const displayText = `Evaluation for entry ${evalData.dpoEntryId.substring(0, 6)}... by PUID ${evalData.participantSessionUid.substring(
    0,
    6,
  )}...`;
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
