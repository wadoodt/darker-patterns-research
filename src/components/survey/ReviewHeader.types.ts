import type { DPOEntry } from '@/types/dpo';

export interface ReviewHeaderProps {
  currentDpoEntryIndex: number;
  dpoEntriesToReview: DPOEntry[];
  currentStepNumber: number;
  totalSteps: number;
}
