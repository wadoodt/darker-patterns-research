import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions/v2';
import { onCall, HttpsError } from 'firebase-functions/v2/https';

if (admin.apps.length === 0) {
  admin.initializeApp();
}
const db = admin.firestore();

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
