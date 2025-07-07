/* eslint-disable max-lines-per-function */
// components/survey/EntryReviewStepContent.tsx
'use client';
import { useCallback, useEffect, useState } from 'react';
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
    goToNextStep,
    completeSurveyAndPersistData,
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

  const { startTour, shouldShowTour } = useSurveyTour();
  const [isFlagModalOpen, setIsFlagModalOpen] = useState(false);

  // Start tour when first entry loads (only if user hasn't seen it before)
  useEffect(() => {
    if (currentDisplayEntry && currentDpoEntryIndex === 0 && !isCurrentEvaluationSubmitted && shouldShowTour) {
      startTour();
    }
  }, [
    currentDisplayEntry,
    currentDpoEntryIndex,
    isCurrentEvaluationSubmitted,
    startTour,
    shouldShowTour,
    currentStepNumber,
  ]);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }, [currentStepNumber, currentDpoEntryIndex]);

  const handleOptionSelect = useCallback(
    (optionKey: 'A' | 'B') => {
      if (isCurrentEvaluationSubmitted || isRevealed) return;
      setSelectedOptionKey(optionKey);
      setLocalError(null);
    },
    [isCurrentEvaluationSubmitted, isRevealed, setSelectedOptionKey, setLocalError],
  );

  const handleReveal = useCallback(() => {
    if (!selectedOptionKey || selectedCategories.length === 0) {
      setLocalError('Please select an option and at least one category to continue.');
      return;
    }
    setLocalError(null);
    setIsRevealed(true);
  }, [selectedOptionKey, selectedCategories.length, setLocalError, setIsRevealed]);

  const handleLocalSubmit = useCallback(() => {
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

    const isLastEntry = currentDpoEntryIndex === dpoEntriesToReview.length - 1;

    if (isLastEntry) {
      completeSurveyAndPersistData();
    } else {
      goToNextStep();
    }
  }, [
    currentDisplayEntry,
    selectedOptionKey,
    agreementRating,
    userComment,
    timeStarted,
    optionAisDPOAccepted,
    selectedCategories,
    dpoEntriesToReview,
    currentDpoEntryIndex,
    submitEvaluationToContext,
    markCurrentEvaluationSubmitted,
    setLocalError,
    goToNextStep,
    completeSurveyAndPersistData,
  ]);

  const handleSubmitFlag = useCallback(
    async (reason: string, comment: string) => {
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
    },
    [participantSessionUid, currentDisplayEntry, setIsFlagModalOpen],
  );

  const canReveal: boolean = Boolean(selectedOptionKey && selectedCategories.length > 0 && !isRevealed);
  const canSubmit: boolean = Boolean(selectedOptionKey && agreementRating > 0 && isRevealed);

  const researcherOptionKey = optionAisDPOAccepted ? 'A' : 'B';
  const userChoiceMatchesResearcher =
    (isRevealed || isCurrentEvaluationSubmitted) && selectedOptionKey === researcherOptionKey;

  return (
    <div className="survey-page-container flex min-h-screen flex-col">
      <div className="flex-1">
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
      </div>
    </div>
  );
};

export default EntryReviewStepContent;
