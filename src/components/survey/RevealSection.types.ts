import type { DPOEntry } from '@/types/dpo';

export interface RevealSectionProps {
  isRevealed: boolean;
  isCurrentEvaluationSubmitted: boolean;
  currentDisplayEntry: DPOEntry | null;
  selectedOptionKey: 'A' | 'B' | null;
  userChoseCorrectlyIfRevealed: boolean;
  dpoEntriesToReview: DPOEntry[];
  currentDpoEntryIndex: number;
}
