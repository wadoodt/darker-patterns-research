// src/hooks/useEntryDetails.ts
'use client';
import { db } from '@/lib/firebase';
import type { DPOEntry, EvaluationData, ParticipantFlag } from '@/types/dpo';
import { collection, doc, getDoc, getDocs, orderBy, query, where } from 'firebase/firestore';
import { useCallback, useEffect, useState } from 'react';

// Helper function to format time spent in a human readable format
const formatTimeSpent = (timeSpentMs: number): string => {
  const minutes = Math.floor(timeSpentMs / 60000);
  const seconds = Math.floor((timeSpentMs % 60000) / 1000);

  if (minutes === 0) {
    return `${seconds}s`;
  }
  return `${minutes}m ${seconds}s`;
};

export interface DisplayEvaluation extends EvaluationData {
  participantDisplayName?: string; // Display name for the participant (could be anonymous/email)
  formattedSubmittedAt?: string; // Human readable date format
  timeSpentFormatted?: string; // Formatted time spent (e.g., "2m 30s")
  participantType?: 'email' | 'anonymous'; // Type of participant who submitted the evaluation
}

interface UseEntryDetailsReturn {
  entry: DPOEntry | null;
  evaluations: DisplayEvaluation[];
  flags: ParticipantFlag[];
  isLoading: boolean;
  error: string | null;
}

export const useEntryDetails = (entryId: string): UseEntryDetailsReturn => {
  const [entry, setEntry] = useState<DPOEntry | null>(null);
  const [evaluations, setEvaluations] = useState<DisplayEvaluation[]>([]);
  const [flags, setFlags] = useState<ParticipantFlag[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!db) {
      setError('Firebase is not initialized. Cannot fetch entry details.');
      setIsLoading(false);
      return;
    }
    if (!entryId) {
      setError('Entry ID is missing. Cannot fetch details.');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    setEntry(null);
    setEvaluations([]);
    setFlags([]);

    try {
      // Fetch DPO Entry
      const entryDocRef = doc(db, 'dpo_entries', entryId);
      const entrySnap = await getDoc(entryDocRef);
      if (!entrySnap.exists()) {
        setError(`Entry with ID ${entryId} not found.`);
        setEntry(null);
        setIsLoading(false);
        return;
      }
      // Ensure targetReviewCount has a default if undefined
      const entryDataFirebase = entrySnap.data();
      const entryData = {
        id: entrySnap.id,
        ...entryDataFirebase,
        targetReviewCount: entryDataFirebase.targetReviewCount || 10, // Default if not set
      } as DPOEntry;
      setEntry(entryData);

      // Fetch Evaluations for this entry
      const evalsQuery = query(
        collection(db, 'evaluations'),
        where('dpoEntryId', '==', entryId),
        orderBy('submittedAt', 'desc'),
      );
      const evalsSnap = await getDocs(evalsQuery);
      const fetchedEvaluations = evalsSnap.docs.map((d) => {
        const evalData = d.data();
        return {
          id: d.id,
          ...evalData,
          participantType: 'anonymous', // Default to anonymous unless we fetch participant info
          formattedSubmittedAt: evalData.submittedAt.toDate().toLocaleString(),
          timeSpentFormatted: formatTimeSpent(evalData.timeSpentMs),
        } as DisplayEvaluation;
      });
      setEvaluations(fetchedEvaluations);

      // Fetch Participant Flags for this entry
      const flagsCollectionRef = collection(db, `dpo_entries/${entryId}/participant_flags`);
      const flagsQuery = query(flagsCollectionRef, orderBy('flaggedAt', 'desc'));
      const flagsSnap = await getDocs(flagsQuery);
      const fetchedFlags = flagsSnap.docs.map((d) => ({ id: d.id, ...d.data() }) as ParticipantFlag);
      setFlags(fetchedFlags);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      console.error(`Error fetching details for entry ${entryId}:`, err);
      setError(`Failed to load entry details. Error: ${errorMessage}`);
      setEntry(null);
    } finally {
      setIsLoading(false);
    }
  }, [entryId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { entry, evaluations, flags, isLoading, error };
};
