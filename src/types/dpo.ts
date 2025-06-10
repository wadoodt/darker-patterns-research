import type { Timestamp } from 'firebase/firestore';

export interface DPOEntry {
  id: string;
  instruction: string;
  prompt?: string;
  acceptedResponse: string;
  rejectedResponse: string;
  category: string;
  discussion?: string; // Optional explanation/discussion visible after evaluation
  reviewCount: number;
  targetReviewCount?: number;
  lastReviewedAt?: Timestamp | Date;
  createdAt?: Timestamp | Date;
  isFlaggedCount?: number;
  lastFlaggedAt?: Timestamp | Date;

  // Fields for "Archive & Create New Version" strategy
  isArchived?: boolean; // True if this entry is an old version and superseded
  archivedAt?: Timestamp | Date; // When it was archived
  originalEntryId?: string; // If this entry is a new version, this links to the ID of the entry it corrects/revises
  supersededByEntryId?: string; // If this entry is archived, this links to the ID of the new entry that replaces it
}

export interface DemographicData {
  ageGroup?: string | null;
  gender?: string | null;
  genderOther?: string | null;
  educationLevel?: string | null;
  educationOther?: string | null;
  fieldOfExpertise?: string | null;
  expertiseOther?: string | null;
  aiFamiliarity?: string | null;
}

export interface EvaluationData {
  id?: string;
  participantSessionUid: string;
  dpoEntryId: string;
  dpoEntryCategory: string;
  chosenOptionKey: 'A' | 'B';
  wasChosenActuallyAccepted: boolean;
  rating: number;
  comment?: string | null;
  timeSpentMs: number;
  submittedAt: Timestamp | Date;
}

// For EvaluationDraft used in SurveyProgressContext and EntryReviewStep
export type EvaluationDraft = Omit<EvaluationData, 'participantSessionUid' | 'dpoEntryCategory' | 'submittedAt' | 'id'>;

export interface ParticipantSession {
  // id: string; // Document ID in Firestore is participantSessionUid
  participationType: 'email' | 'anonymous';
  email?: string | null;
  termsAgreed: boolean;
  demographics: DemographicData | null;
  assignedEntriesCount: number;
  completedEntriesCount: number;
  totalTimeSpentMsOnSurvey?: number;
  optedInForPaper?: boolean;
  createdAt?: Timestamp | Date; // Made optional, will be set on first write
  surveyCompletedAt?: Timestamp | Date | null;
}

export interface ParticipantFlag {
  id?: string; // Firestore document ID, auto-generated
  participantSessionUid: string;
  reason: string; // Could be one of predefined or "Other"
  comment?: string | null; // Detailed comment if reason is "Other" or additional notes
  flaggedAt: Timestamp | Date;
  dpoEntryCategory?: string;
}
