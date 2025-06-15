import { db } from '@/lib/firebase';
import type { DPOEntry, EvaluationData, ParticipantSession } from '@/types/dpo';
import {
  collection,
  doc,
  getDocs,
  Firestore,
  increment,
  limit,
  orderBy,
  query,
  runTransaction,
  serverTimestamp,
} from 'firebase/firestore';

export async function generateDummyEntries(count: number): Promise<DPOEntry[]> {
  return Array.from({ length: count }).map((_, i) => ({
    id: `dummyEntry${i + 1}-${crypto.randomUUID().substring(0, 4)}`,
    instruction: `This is the primary instruction for dummy DPO entry ${i + 1}. Analyze based on the prompt provided.`,
    prompt: `Original prompt example for entry ${i + 1}: "Explain quantum entanglement simply."`,
    acceptedResponse: `Response A for dummy entry ${i + 1}: (Better response with simpler language and clearer examples)`,
    rejectedResponse: `Response B for dummy entry ${i + 1}: (Less ideal response with potential dark patterns)`,
    category: i % 3 === 0 ? 'Obscuring Information' : i % 3 === 1 ? 'Misleading Content' : 'Privacy Harm',
    discussion: `Expert discussion for entry ${i + 1}, explaining the rationale for the preferred response.`,
    reviewCount: Math.floor(Math.random() * 5),
  }));
}

/**
 * Fetches a specified number of DPO entries from Firestore, prioritizing those with the lowest review count.
 * This function is intended for use in production environments where real data is needed.
 *
 * @param count The number of entries to fetch.
 * @returns A promise that resolves to an array of DPOEntry objects.
 * @throws Throws an error if Firebase is not initialized or if fetching fails.
 */
export async function fetchAndAssignEntries(count: number): Promise<DPOEntry[]> {
  if (!db) {
    throw new Error('Firebase is not initialized. Ensure your environment configuration is correct.');
  }

  try {
    // Query to get entries with the lowest review count
    const entriesCollectionRef = collection(db as Firestore, 'dpo_entries');
    const q = query(entriesCollectionRef, orderBy('reviewCount', 'asc'), limit(count));

    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.warn('No DPO entries found in the database. Returning an empty array.');
      return [];
    }

    const entries = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as DPOEntry[];

    return entries;
  } catch (error) {
    console.error('Error fetching DPO entries:', error);
    // Re-throw the error to be handled by the calling function
    throw new Error('Failed to fetch DPO entries from the database.');
  }
}

export async function persistSurveyData(
  participantSessionUid: string,
  participantData: Partial<ParticipantSession>,
  evaluations: EvaluationData[],
): Promise<void> {
  if (!db) throw new Error('Firebase is not initialized');

  await runTransaction(db, async (transaction) => {
    const participantDocRef = doc(db as Firestore, 'survey_participants', participantSessionUid);
    const participantSnap = await transaction.get(participantDocRef);

    if (!participantSnap.exists()) {
      transaction.set(participantDocRef, { ...participantData, createdAt: serverTimestamp() });
    } else {
      transaction.update(participantDocRef, participantData);
    }

    // Save each evaluation and update entry review counts
    for (const evaluation of evaluations) {
      const evalDocRef = doc(collection(db as Firestore, 'evaluations'));
      const { id, ...evalDataToSave } = evaluation;
      console.warn('Saving evaluation:', id);
      transaction.set(evalDocRef, { ...evalDataToSave, submittedAt: serverTimestamp() });

      if (!evaluation.dpoEntryId.startsWith('dummyEntry')) {
        const dpoEntryRef = doc(db as Firestore, 'dpo_entries', evaluation.dpoEntryId);
        transaction.update(dpoEntryRef, {
          reviewCount: increment(1),
          lastReviewedAt: serverTimestamp(),
        });
      }
    }
  });
}
