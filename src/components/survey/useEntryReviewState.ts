import { useEffect, useState } from 'react';
import { useSurveyProgress } from '../../contexts/SurveyProgressContext';
import type { DPOEntry } from '../../types/dpo';

export function useEntryReviewState() {
  const {
    getCurrentDpoEntry,
    currentDpoEntryIndex,
    resetCurrentEvaluationSubmitted,
    setGlobalError,
    setHasUnsavedChanges,
    isCurrentEvaluationSubmitted,
  } = useSurveyProgress();

  const [currentDisplayEntry, setCurrentDisplayEntry] = useState<DPOEntry | null>(null);
  const [optionAContent, setOptionAContent] = useState<string>('');
  const [optionBContent, setOptionBContent] = useState<string>('');
  const [optionAisDPOAccepted, setOptionAisDPOAccepted] = useState<boolean>(false);
  const [selectedOptionKey, setSelectedOptionKey] = useState<'A' | 'B' | null>(null);
  const [agreementRating, setAgreementRating] = useState<number>(0);
  const [userComment, setUserComment] = useState<string>('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [timeStarted, setTimeStarted] = useState<number>(0);
  const [localError, setLocalError] = useState<string | null>(null);
  const [isRevealed, setIsRevealed] = useState<boolean>(false);

  useEffect(() => {
    setGlobalError(null);
    const entry = getCurrentDpoEntry();
    setCurrentDisplayEntry(entry);
    if (entry) {
      const isDatasetAcceptedRandomlyAssignedToA = Math.random() < 0.5;
      setOptionAContent(isDatasetAcceptedRandomlyAssignedToA ? entry.acceptedResponse : entry.rejectedResponse);
      setOptionBContent(isDatasetAcceptedRandomlyAssignedToA ? entry.rejectedResponse : entry.acceptedResponse);
      setOptionAisDPOAccepted(isDatasetAcceptedRandomlyAssignedToA);
      setSelectedOptionKey(null);
      setAgreementRating(0);
      setUserComment('');
      setSelectedCategories(entry.categories || []);
      setTimeStarted(Date.now());
      resetCurrentEvaluationSubmitted();
      setLocalError(null);
      setIsRevealed(false);
    } else {
      setHasUnsavedChanges(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentDpoEntryIndex, getCurrentDpoEntry]);

  // Effect to signal unsaved changes when form fields change before submission
  useEffect(() => {
    if (
      currentDisplayEntry &&
      !isCurrentEvaluationSubmitted &&
      (selectedOptionKey || agreementRating > 0 || userComment)
    ) {
      setHasUnsavedChanges(true);
    }
  }, [
    selectedOptionKey,
    agreementRating,
    userComment,
    currentDisplayEntry,
    isCurrentEvaluationSubmitted,
    setHasUnsavedChanges,
  ]);

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
    setTimeStarted,
    localError,
    setLocalError,
    isRevealed,
    setIsRevealed,
  };
}
