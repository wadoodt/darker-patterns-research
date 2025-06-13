export interface RatingSectionProps {
  selectedOptionKey: 'A' | 'B' | null;
  isCurrentEvaluationSubmitted: boolean;
  userRating: number;
  setUserRating: (rating: number) => void;
}
