export interface CommentsSectionProps {
  selectedOptionKey: 'A' | 'B' | null;
  userRating: number;
  isCurrentEvaluationSubmitted: boolean;
  userComment: string;
  setUserComment: (comment: string) => void;
}
