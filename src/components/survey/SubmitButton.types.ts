export interface SubmitButtonProps {
  isCurrentEvaluationSubmitted: boolean;
  selectedOptionKey: 'A' | 'B' | null;
  userRating: number;
  handleLocalSubmitAndReveal: () => void;
  canSubmitLocal: boolean;
  isLoadingEntries: boolean;
}
