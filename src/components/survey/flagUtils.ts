import { db } from '@/lib/firebase';
import { DPOEntry } from '@/types/dpo';
import { addDoc, collection, doc, increment, serverTimestamp, updateDoc } from 'firebase/firestore';

export async function submitFlagForEntry({
  currentDisplayEntry,
  participantSessionUid,
  reason,
  comment,
  onSuccess,
  onError,
  onFinally,
}: {
  currentDisplayEntry: DPOEntry | null;
  participantSessionUid: string;
  reason: string;
  comment: string;
  onSuccess?: () => void;
  onError?: (err: unknown) => void;
  onFinally?: () => void;
}) {
  if (!currentDisplayEntry || !currentDisplayEntry.id || !participantSessionUid) {
    alert('Cannot submit flag: missing entry data or session information.');
    onFinally?.();
    return;
  }
  if (process.env.NODE_ENV === 'test' || !db) {
    alert('Flagging is currently simulated. Your feedback is noted.');
    onFinally?.();
    return;
  }
  const flagData = {
    participantSessionUid,
    reason,
    comment: comment.trim() || null,
    flaggedAt: serverTimestamp(),
    dpoEntryCategory: currentDisplayEntry.category,
  };
  const entryDocRef = doc(db, 'dpo_entries', currentDisplayEntry.id);
  const flagsCollectionRef = collection(entryDocRef, 'participant_flags');
  try {
    await addDoc(flagsCollectionRef, flagData);
    await updateDoc(entryDocRef, {
      isFlaggedCount: increment(1),
      lastFlaggedAt: serverTimestamp(),
    });
    alert('Entry flagged successfully. Thank you for your feedback.');
    onSuccess?.();
  } catch (err) {
    console.error('Error submitting flag:', err);
    alert(`Failed to submit flag. Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    onError?.(err);
  } finally {
    onFinally?.();
  }
}
