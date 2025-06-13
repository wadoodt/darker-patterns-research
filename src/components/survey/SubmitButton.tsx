import { Button } from '@/components/ui/button';
import { SubmitButtonProps } from './SubmitButton.types';

export default function SubmitButton({
  isCurrentEvaluationSubmitted,
  selectedOptionKey,
  userRating,
  handleLocalSubmitAndReveal,
  canSubmitLocal,
  isLoadingEntries,
}: SubmitButtonProps) {
  if (isCurrentEvaluationSubmitted || !selectedOptionKey || userRating === 0) return null;
  return (
    <div className="mt-1 mb-5 text-center">
      <Button
        onClick={handleLocalSubmitAndReveal}
        disabled={!canSubmitLocal || isLoadingEntries}
        className="btn-primary-light min-w-[220px] px-6 py-2.5 text-sm"
      >
        Submit Evaluation &amp; See Rationale
      </Button>
    </div>
  );
}
