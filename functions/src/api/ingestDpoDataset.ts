import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions/v2';
import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { ingestDpoDatasetSchema } from '../schemas/dpo_entry';

if (admin.apps.length === 0) {
  admin.initializeApp();
}
const db = admin.firestore();

export const ingestDpoDataset = onCall(async (request) => {
  // 1. Authentication & Authorization
  if (!request.auth) {
    // This checks if the user is authenticated at all.
    throw new HttpsError('unauthenticated', 'The function must be called by an authenticated user.');
  }

  // Check if the authenticated user is an administrator by reading their Firestore document.
  const userDoc = await db.collection('users').doc(request.auth.uid).get();
  const userData = userDoc.data();
  if (!userDoc.exists || !Array.isArray(userData?.roles) || !userData?.roles.includes('admin')) {
    throw new HttpsError(
      'permission-denied',
      `The function must be called by an administrator. Current roles for user ${request.auth.uid}: ${userData?.roles}`,
    );
  }

  // 2. Input Validation using Zod
  const parseResult = ingestDpoDatasetSchema.safeParse(request.data);
  if (!parseResult.success) {
    const formattedErrors = parseResult.error.errors.map((e) => `Field '${e.path.join('.')}': ${e.message}`).join('\n');
    throw new HttpsError(
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
    const currentHighestId = adminSettingsDoc.data()?.highestDpoId || 0;
    let nextId = currentHighestId;

    entries.forEach((entry) => {
      nextId++;
      const newEntryRef = dpoEntriesRef.doc(String(nextId).padStart(5, '0'));
      const newEntry = {
        ...entry,
        id: newEntryRef.id,
        reviewCount: 0,
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
    throw new HttpsError('internal', 'An error occurred while ingesting the dataset.', error);
  }
});
