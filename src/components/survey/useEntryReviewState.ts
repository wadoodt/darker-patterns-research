'use client';
import { useEffect, useState } from 'react';
import { useSurveyProgress } from '../../contexts/SurveyProgressContext';

export function useEntryReviewState() {
  const { currentDisplayEntry } = useSurveyProgress();

  const [selectedOptionKey, setSelectedOptionKey] = useState<'A' | 'B' | null>(
    currentDisplayEntry?.userSelectedOptionKey || null,
  );
  const [agreementRating, setAgreementRating] = useState<number>(currentDisplayEntry?.userAgreementRating || 0);
  const [userComment, setUserComment] = useState<string>(currentDisplayEntry?.userComment || '');
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    currentDisplayEntry?.userSelectedCategories || [],
  );
  const [localError, setLocalError] = useState<string | null>(null);
  const [isRevealed, setIsRevealed] = useState<boolean>(currentDisplayEntry?.isUserRevealed || false);

  const [timeStarted, setTimeStarted] = useState<number>(Date.now());

  const optionAContent = currentDisplayEntry?.acceptedResponse || '';
  const optionBContent = currentDisplayEntry?.rejectedResponse || '';
  const optionAisDPOAccepted = currentDisplayEntry?.acceptedResponse ? true : false;

  useEffect(() => {
    if (currentDisplayEntry) {
      setSelectedOptionKey(currentDisplayEntry.userSelectedOptionKey || null);
      setAgreementRating(currentDisplayEntry.userAgreementRating || 0);
      setUserComment(currentDisplayEntry.userComment || '');
      setSelectedCategories(currentDisplayEntry.userSelectedCategories || []);
      setIsRevealed(currentDisplayEntry.isUserRevealed || false);
      setTimeStarted(Date.now());
    } else {
      setSelectedOptionKey(null);
      setAgreementRating(0);
      setUserComment('');
      setSelectedCategories([]);
      setIsRevealed(false);
      setTimeStarted(Date.now());
    }
    setLocalError(null);
  }, [currentDisplayEntry]);

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
