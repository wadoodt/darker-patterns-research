import type { DPOOption } from '@/types/dpo';

export interface OptionsSectionProps {
  options: DPOOption[];
  selectedOptionKey: 'A' | 'B' | null;
  handleOptionSelect: (optionKey: 'A' | 'B') => void;
  isUIBlocked: boolean;
  isRevealed: boolean;
  researcherOptionKey: 'A' | 'B';
}
