import { db } from '@/lib/firebase';
import type { EvaluationData, ParticipantSession } from '@/types/dpo';
import {
  addDoc,
  collection,
  doc,
  Firestore,
  increment,
  runTransaction,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';

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

export async function submitFlagForEntry({
  dpoEntryId,
  dpoEntryCategory,
  participantSessionUid,
  reason,
  comment,
}: {
  dpoEntryId: string;
  dpoEntryCategory: string;
  participantSessionUid: string;
  reason: string;
  comment: string;
}) {
  if (!db) throw new Error('Firebase is not initialized');

  const flagData = {
    dpoEntryId,
    dpoEntryCategory,
    participantSessionUid,
    reason,
    comment: comment.trim() || null,
    flaggedAt: serverTimestamp(),
  };

  const flagsCollectionRef = collection(db, 'participant_flags');
  await addDoc(flagsCollectionRef, flagData);

  const entryDocRef = doc(db, 'dpo_entries', dpoEntryId);
  await updateDoc(entryDocRef, {
    isFlaggedCount: increment(1),
    lastFlaggedAt: serverTimestamp(),
  });
}

export async function updateParticipantEmail(participantSessionUid: string, email: string): Promise<void> {
  if (!db) throw new Error('Firebase is not initialized');
  if (!participantSessionUid) {
    throw new Error('Participant session UID is required to update email.');
  }

  const participantDocRef = doc(db as Firestore, 'survey_participants', participantSessionUid);

  await updateDoc(participantDocRef, {
    email,
    participationType: 'email',
    optedInForPaper: true,
  });
}
