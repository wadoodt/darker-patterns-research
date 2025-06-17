// src/hooks/useEntryDetails.ts
'use client';
import type { DPOEntry, EvaluationData, ParticipantFlag } from '@/types/dpo';
import { getEntryDetails } from '@/lib/firestore/queries/survey';
import { useCallback, useEffect, useState } from 'react';
import type { Timestamp } from 'firebase/firestore';

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
      // Fetch entry details, evaluations, and flags using the centralized function
      const { entry: entryData, evaluations: fetchedEvaluations, flags: fetchedFlags } = await getEntryDetails(entryId);

      if (!entryData) {
        setError(`Entry with ID ${entryId} not found.`);
        setIsLoading(false);
        return;
      }

      // Ensure targetReviewCount has a default if undefined
      const entryWithDefaults = {
        ...entryData,
        targetReviewCount: entryData.targetReviewCount || 10, // Default if not set
      };

      setEntry(entryWithDefaults);

      // Format evaluations for display
      const formattedEvaluations = fetchedEvaluations.map((evalData) => {
        // Handle both Timestamp and Date objects for submittedAt
        let submittedAt: Date | null = null;
        if (evalData.submittedAt) {
          // Type guard to check if it's a Firestore Timestamp
          const isTimestamp = (val: unknown): val is Timestamp =>
            val !== null &&
            typeof val === 'object' &&
            'toDate' in val &&
            typeof (val as Timestamp).toDate === 'function';

          submittedAt = isTimestamp(evalData.submittedAt)
            ? evalData.submittedAt.toDate()
            : new Date(evalData.submittedAt);
        }

        return {
          ...evalData,
          participantType: 'anonymous' as const, // Explicitly type as 'anonymous' literal
          formattedSubmittedAt: submittedAt ? submittedAt.toLocaleString() : 'Unknown date',
          timeSpentFormatted: formatTimeSpent(evalData.timeSpentMs || 0),
        };
      });

      setEvaluations(formattedEvaluations);
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
