import type { EvaluationDraft } from '../../types/dpo';

export function buildEvaluationDraft({
  currentDisplayEntry,
  selectedOptionKey,
  agreementRating,
  userComment,
  timeStarted,
  optionAisDPOAccepted,
  selectedCategories,
}: {
  currentDisplayEntry: { id: string } | null;
  selectedOptionKey: 'A' | 'B' | null;
  agreementRating: number;
  userComment: string;
  timeStarted: number;
  optionAisDPOAccepted: boolean;
  selectedCategories: string[];
}): EvaluationDraft | string {
  if (!selectedOptionKey) {
    return 'Please select either Option A or Option B.';
  }
  if (agreementRating === 0) {
    return 'Please provide a rating (1-5 stars) for your choice.';
  }
  if (!currentDisplayEntry || !currentDisplayEntry.id) {
    return 'Error: No entry loaded to submit. Please refresh or contact support.';
  }
  const timeSpentMs = Date.now() - timeStarted;
  const wasChosenActuallyAccepted =
    (selectedOptionKey === 'A' && optionAisDPOAccepted) || (selectedOptionKey === 'B' && !optionAisDPOAccepted);
  return {
    dpoEntryId: currentDisplayEntry.id,
    chosenOptionKey: selectedOptionKey,
    agreementRating: agreementRating,
    comment: userComment.trim(),
    timeSpentMs,
    wasChosenActuallyAccepted,
    categories: selectedCategories,
  };
}
