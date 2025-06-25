import type { ParticipantFlag } from './dpo';

export interface DisplaySubmission extends Omit<ParticipantFlag, 'flaggedAt' | 'remediatedAt'> {
  id: string; // Ensure id is not optional
  flaggedAt: string; // ISO string for serializing
  remediatedAt?: string; // ISO string for serializing
}

export type SortableSubmissionKeys = 'flaggedAt' | 'status' | 'reason';
