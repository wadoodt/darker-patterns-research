import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import { db, functions } from '@/lib/firebase';
import type { DPOEntry } from '@/types/dpo';

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

export const addDPOEntry = async (entry: Omit<DPOEntry, 'id'>) => {
  if (!db) {
    throw new Error('Firestore is not initialized');
  }

  try {
    const docRef = await addDoc(collection(db, 'dpoEntries'), {
      ...entry,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding DPO entry: ', error);
    throw new Error('Failed to add DPO entry to the database.');
  }
};
