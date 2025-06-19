import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions/v2';
import { onCall } from 'firebase-functions/v2/https';
import { processEntryDetails } from '../entry-details';
import type { DPOEntry, EvaluationData, ParticipantFlag } from '../types';

// Initialize Firebase Admin SDK if it hasn't been already.
if (admin.apps.length === 0) {
  admin.initializeApp();
}
const db = admin.firestore();

/**
 * Fetches the full details for a given DPO entry, including evaluations and analytics.
 */
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

    return { entryDetails };
  } catch (error) {
    functions.logger.error(`Error getting entry details for ${entryId}:`, error);
    if (error instanceof functions.https.HttpsError) {
      throw error;
    }
    throw new functions.https.HttpsError('internal', 'An error occurred while fetching entry details.');
  }
});
