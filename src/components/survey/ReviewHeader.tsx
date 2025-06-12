import type { DPOEntry } from '@/types/dpo';

export interface ReviewHeaderProps {
  currentDpoEntryIndex: number;
  dpoEntriesToReview: DPOEntry[];
  currentStepNumber: number;
  totalSteps: number;
}

export default function ReviewHeader({
  currentDpoEntryIndex,
  dpoEntriesToReview,
  currentStepNumber,
  totalSteps,
}: ReviewHeaderProps) {
  return (
    <div className="survey-step-title-container mb-2 text-center">
      <p className="survey-step-indicator">
        Entry {Math.min(currentDpoEntryIndex + 1, dpoEntriesToReview.length)} of {dpoEntriesToReview.length}
        <span className="mx-1 text-gray-400">|</span>
        Step {currentStepNumber} of {totalSteps}
      </p>
      <h2 className="survey-main-title !text-2xl">Evaluate AI Responses</h2>
    </div>
  );
}
