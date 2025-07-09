'use client';
import { useEffect, useState } from 'react';
import { useSurveyProgress } from '../../contexts/SurveyProgressContext';

export function useEntryReviewState() {
  const { currentDisplayEntry, dpoEntriesToReview, currentDpoEntryIndex, evaluations, isCurrentEvaluationSubmitted } =
    useSurveyProgress();

  const currentEntry = dpoEntriesToReview[currentDpoEntryIndex];
  const existingEvaluation = evaluations.find((evaluation) => evaluation.dpoEntryId === currentEntry?.id);

  const [selectedOptionKey, setSelectedOptionKey] = useState<'A' | 'B' | null>(
    existingEvaluation ? existingEvaluation.chosenOptionKey : null,
  );
  const [agreementRating, setAgreementRating] = useState<number>(
    existingEvaluation ? existingEvaluation.agreementRating : 0,
  );
  const [userComment, setUserComment] = useState<string>(existingEvaluation ? existingEvaluation.comment || '' : '');
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    existingEvaluation ? existingEvaluation.categories : [],
  );
  const [localError, setLocalError] = useState<string | null>(null);
  const [isRevealed, setIsRevealed] = useState<boolean>(existingEvaluation ? true : false);

  const optionAContent = currentDisplayEntry?.acceptedResponse || '';
  const optionBContent = currentDisplayEntry?.rejectedResponse || '';
  const optionAisDPOAccepted = currentDisplayEntry?.acceptedResponse ? true : false;

  useEffect(() => {
    if (currentEntry) {
      const evalForEntry = evaluations.find((evaluation) => evaluation.dpoEntryId === currentEntry.id);
      if (evalForEntry) {
        setSelectedOptionKey(evalForEntry.chosenOptionKey);
        setAgreementRating(evalForEntry.agreementRating);
        setUserComment(evalForEntry.comment || '');
        setSelectedCategories(evalForEntry.categories);
        setIsRevealed(true);

        if (!isCurrentEvaluationSubmitted) {
        }
      } else {
        setSelectedOptionKey(null);
        setAgreementRating(0);
        setUserComment('');
        setSelectedCategories([]);
        setIsRevealed(false);
      }
      setLocalError(null);
    }
  }, [currentDpoEntryIndex, currentEntry, evaluations, isCurrentEvaluationSubmitted]);

  const timeStarted = Date.now();

  return {
    currentDisplayEntry,
    optionAContent,
    optionBContent,
    optionAisDPOAccepted,
    selectedOptionKey,
    setSelectedOptionKey,
    agreementRating,
    setAgreementRating,
    userComment,
    setUserComment,
    selectedCategories,
    setSelectedCategories,
    timeStarted,
    localError,
    setLocalError,
    isRevealed,
    setIsRevealed,
  };
}
