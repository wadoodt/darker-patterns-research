/* eslint-disable max-lines-per-function */
// components/survey/EntryReviewStepContent.tsx
'use client';
import { useEffect, useState } from 'react';
import { useSurveyProgress } from '../../contexts/SurveyProgressContext';
import { useSurveyTour } from '../../hooks/useSurveyTour';
import EntryReviewStepContentView from './EntryReviewStepContentView';
import { buildEvaluationDraft } from './evaluationUtils';
import { submitFlagForEntry } from './flagUtils';
import { useEntryReviewState } from './useEntryReviewState';

const EntryReviewStepContent: React.FC = () => {
  const {
    currentStepNumber,
    totalSteps,
    submitEvaluation: submitEvaluationToContext,
    dpoEntriesToReview,
    currentDpoEntryIndex,
    isLoadingEntries,
    participantSessionUid,
    markCurrentEvaluationSubmitted,
    isCurrentEvaluationSubmitted,
    error: contextError,
  } = useSurveyProgress();

  const {
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
  } = useEntryReviewState();

  // add a flag so tour only ever runs once
  const [tourHasRun, setTourHasRun] = useState(false);

  const { startTour } = useSurveyTour();
  const [isFlagModalOpen, setIsFlagModalOpen] = useState(false);

  // Start tour when first entry loads (only once)
  useEffect(() => {
    if (currentDisplayEntry && currentDpoEntryIndex === 0 && !isCurrentEvaluationSubmitted && !tourHasRun) {
      // Small delay to ensure DOM is ready
      const timer = setTimeout(() => {
        startTour();
        setTourHasRun(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [currentDisplayEntry, currentDpoEntryIndex, isCurrentEvaluationSubmitted, startTour, tourHasRun]);

  const handleOptionSelect = (optionKey: 'A' | 'B') => {
    if (isCurrentEvaluationSubmitted || isRevealed) return;
    setSelectedOptionKey(optionKey);
    setLocalError(null);
  };

  const handleReveal = () => {
    if (!selectedOptionKey || selectedCategories.length === 0) {
      setLocalError('Please select an option and at least one category to continue.');
      return;
    }
    setLocalError(null);
    setIsRevealed(true);
  };

  const handleLocalSubmit = () => {
    setLocalError(null);
    const result = buildEvaluationDraft({
      currentDisplayEntry,
      selectedOptionKey,
      agreementRating,
      userComment,
      timeStarted,
      optionAisDPOAccepted,
      selectedCategories,
    });

    if (typeof result === 'string') {
      setLocalError(result);
      return;
    }

    const currentEntry = dpoEntriesToReview[currentDpoEntryIndex];
    if (!currentEntry) {
      setLocalError('No current entry to submit evaluation for.');
      return;
    }
    submitEvaluationToContext(result, currentEntry);
    markCurrentEvaluationSubmitted();
  };

  const handleSubmitFlag = async (reason: string, comment: string) => {
    if (!participantSessionUid) {
      alert('Cannot submit flag: missing session information.');
      setIsFlagModalOpen(false);
      return;
    }
    await submitFlagForEntry({
      currentDisplayEntry,
      participantSessionUid,
      reason,
      comment,
      onFinally: () => setIsFlagModalOpen(false),
    });
  };

  const canReveal: boolean = Boolean(selectedOptionKey && selectedCategories.length > 0 && !isRevealed);
  const canSubmit: boolean = Boolean(selectedOptionKey && agreementRating > 0 && isRevealed);

  const researcherOptionKey = optionAisDPOAccepted ? 'A' : 'B';
  const userChoiceMatchesResearcher =
    (isRevealed || isCurrentEvaluationSubmitted) && selectedOptionKey === researcherOptionKey;

  return (
    <EntryReviewStepContentView
      currentDisplayEntry={currentDisplayEntry}
      currentDpoEntryIndex={currentDpoEntryIndex}
      dpoEntriesToReview={dpoEntriesToReview}
      currentStepNumber={currentStepNumber}
      totalSteps={totalSteps}
      isLoadingEntries={isLoadingEntries}
      isCurrentEvaluationSubmitted={isCurrentEvaluationSubmitted}
      isRevealed={isRevealed}
      selectedOptionKey={selectedOptionKey}
      agreementRating={agreementRating}
      userComment={userComment}
      selectedCategories={selectedCategories}
      localError={localError}
      contextError={contextError}
      isFlagModalOpen={isFlagModalOpen}
      canReveal={canReveal}
      canSubmit={canSubmit}
      userChoiceMatchesResearcher={userChoiceMatchesResearcher}
      researcherOptionKey={researcherOptionKey}
      optionAContent={optionAContent}
      optionBContent={optionBContent}
      handleOptionSelect={handleOptionSelect}
      setAgreementRating={setAgreementRating}
      setUserComment={setUserComment}
      setSelectedCategories={setSelectedCategories}
      handleReveal={handleReveal}
      handleLocalSubmit={handleLocalSubmit}
      setIsFlagModalOpen={setIsFlagModalOpen}
      handleSubmitFlag={handleSubmitFlag}
    />
  );
};

export default EntryReviewStepContent;
