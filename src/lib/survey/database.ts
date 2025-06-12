import { db } from '@/lib/firebase';
import type { DPOEntry, EvaluationData, ParticipantSession } from '@/types/dpo';
import { collection, doc, Firestore, increment, runTransaction, serverTimestamp } from 'firebase/firestore';

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
