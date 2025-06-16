import { db } from '@/lib/firebase';
import type { EvaluationData, ParticipantSession } from '@/types/dpo';
import { collection, doc, Firestore, increment, runTransaction, serverTimestamp } from 'firebase/firestore';

// Firestore survey-related mutations (writes/updates/deletes)
// Move survey mutation functions here from src/lib/survey/database.ts

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
