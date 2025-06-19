import * as admin from 'firebase-admin';
import type { Timestamp as FirebaseAdminTimestamp } from 'firebase-admin/firestore';
import * as functions from 'firebase-functions/v2';
import { onCall, HttpsError } from 'firebase-functions/v2/https';
import type { DPOEntry } from '../types';

if (admin.apps.length === 0) {
  admin.initializeApp();
}
const db = admin.firestore();

export const reviseDpoEntry = onCall(async (request) => {
  // 1. Authentication & Authorization
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'The function must be called by an authenticated user.');
  }

  const userDoc = await db.collection('users').doc(request.auth.uid).get();
  const userData = userDoc.data();
  if (!userDoc.exists || !Array.isArray(userData?.roles) || !userData?.roles.includes('admin')) {
    throw new HttpsError('permission-denied', 'The function must be called by an administrator.');
  }

  // 2. Data Validation
  const { originalEntryId, correctedData } = request.data;
  if (!originalEntryId || !correctedData) {
    throw new HttpsError('invalid-argument', 'Missing originalEntryId or correctedData.');
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
    throw new HttpsError('internal', errorMessage, error);
  }
});
