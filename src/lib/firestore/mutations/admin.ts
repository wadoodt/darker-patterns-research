import { httpsCallable } from 'firebase/functions';
import { functions } from '@/lib/firebase';

export async function ingestDpoDataset(fileContent: string): Promise<{ success: boolean; message: string }> {
  if (!functions) {
    throw new Error('Firebase Functions is not initialized');
  }

  const ingestDpoDatasetFn = httpsCallable<unknown, { success: boolean; message: string }>(
    functions,
    'ingestDpoDataset',
  );

  try {
    const data = JSON.parse(fileContent);
    const result = await ingestDpoDatasetFn(data);
    return { success: result.data.success, message: result.data.message };
  } catch (error) {
    console.error('Error in ingestDpoDataset:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred during ingestion.';
    return { success: false, message: errorMessage };
  }
}
