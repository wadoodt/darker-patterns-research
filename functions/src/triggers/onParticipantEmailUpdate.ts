import * as admin from 'firebase-admin';
import type { Timestamp as FirebaseAdminTimestamp } from 'firebase-admin/firestore';
import * as functions from 'firebase-functions/v2';
import { onDocumentWritten } from 'firebase-functions/v2/firestore';
import type { ParticipantSession } from '../types';

if (admin.apps.length === 0) {
  admin.initializeApp();
}
const db = admin.firestore();

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
