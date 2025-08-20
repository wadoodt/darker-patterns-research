import * as admin from 'firebase-admin';
import { getStorage } from 'firebase-admin/storage';
import * as functions from 'firebase-functions/v2';
import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { processEntryDetails } from '../entry-details';
import type { DPOEntry, EvaluationData, ParticipantFlag } from '../types';

// Define a specific type for the objects being exported
interface AugmentedDpoEntryForExport extends DPOEntry {
  evaluationCount: number;
  chosenOverPairCount: number;
  agreementRate: number;
}

if (admin.apps.length === 0) {
  admin.initializeApp();
}
const db = admin.firestore();

export const exportDpoDataset = onCall(async (request) => {
  // 1. Authentication & Authorization
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'The function must be called by an authenticated user.');
  }

  const userDoc = await db.collection('users').doc(request.auth.uid).get();
  const userData = userDoc.data();
  if (!userDoc.exists || !Array.isArray(userData?.roles) || !userData?.roles.includes('admin')) {
    throw new HttpsError(
      'permission-denied',
      `The function must be called by an administrator. Current roles for user ${request.auth.uid}: ${userData?.roles}`,
    );
  }

  // 2. Input Validation
  const { format = 'json', includeArchived = false } = request.data;
  if (format !== 'json' && format !== 'csv') {
    throw new HttpsError('invalid-argument', "The 'format' parameter must be 'json' or 'csv'.");
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
    const augmentedEntries: AugmentedDpoEntryForExport[] = [];

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
        const rows = augmentedEntries.map((entry) => {
          return Object.values(entry)
            .map((value: unknown) => {
              if (value === null || value === undefined) {
                return '';
              }
              if (typeof value === 'string') {
                return `"${value.replace(/"/g, '""')}"`;
              }
              if (Array.isArray(value)) {
                return `"${value.join(';')}"`;
              }
              if (typeof value === 'object' && value && Object.prototype.hasOwnProperty.call(value, '_seconds')) {
                return new Date((value as { _seconds: number })._seconds * 1000).toISOString();
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
    throw new HttpsError('internal', errorMessage, error);
  }
});
