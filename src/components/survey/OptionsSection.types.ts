import type { DPOOption } from '@/types/dpo';

export interface OptionsSectionProps {
  options: DPOOption[];
  selectedOptionKey: 'A' | 'B' | null;
  isCurrentEvaluationSubmitted: boolean;
  handleOptionSelect: (optionKey: 'A' | 'B') => void;
  userChoseCorrectlyIfRevealed: boolean;
}
