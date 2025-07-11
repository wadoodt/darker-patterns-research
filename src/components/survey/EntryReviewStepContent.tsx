/* eslint-disable max-lines-per-function */
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
    isCurrentEvaluationSubmitted,
    error: contextError,
    goToNextStep,
    completeSurveyAndPersistData,
    currentDisplayEntry,
    updateDpoEntryUserState,
  } = useSurveyProgress();

  const {
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

  useEffect(() => {
    if (currentDisplayEntry?.id && currentDpoEntryIndex === 0 && !isCurrentEvaluationSubmitted && shouldShowTour) {
      const timer = setTimeout(() => {
        startTour();
      }, 500);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentDisplayEntry, currentDpoEntryIndex, isCurrentEvaluationSubmitted, shouldShowTour]);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }, [currentStepNumber, currentDpoEntryIndex]);

  const handleOptionSelect = useCallback(
    (optionKey: 'A' | 'B') => {
      if (currentDisplayEntry?.isUserEvaluationSubmitted || isRevealed) return;
      setSelectedOptionKey(optionKey);
      setLocalError(null);
      if (currentDisplayEntry?.id) {
        updateDpoEntryUserState(currentDisplayEntry.id, { userSelectedOptionKey: optionKey });
      }
    },
    [currentDisplayEntry, isRevealed, setSelectedOptionKey, setLocalError, updateDpoEntryUserState],
  );

  const handleSetAgreementRating = useCallback(
    (rating: number) => {
      setAgreementRating(rating);
      if (currentDisplayEntry?.id) {
        updateDpoEntryUserState(currentDisplayEntry.id, { userAgreementRating: rating });
      }
    },
    [setAgreementRating, currentDisplayEntry, updateDpoEntryUserState],
  );

  const handleSetUserComment = useCallback(
    (comment: string) => {
      setUserComment(comment);
      if (currentDisplayEntry?.id) {
        updateDpoEntryUserState(currentDisplayEntry.id, { userComment: comment });
      }
    },
    [setUserComment, currentDisplayEntry, updateDpoEntryUserState],
  );

  const handleSetSelectedCategories = useCallback(
    (categories: string[]) => {
      setSelectedCategories(categories);
      if (currentDisplayEntry?.id) {
        updateDpoEntryUserState(currentDisplayEntry.id, { userSelectedCategories: categories });
      }
    },
    [setSelectedCategories, currentDisplayEntry, updateDpoEntryUserState],
  );

  const handleReveal = useCallback(() => {
    if (!selectedOptionKey || selectedCategories.length === 0) {
      setLocalError('Please select an option and at least one category to continue.');
      return;
    }
    setLocalError(null);
    setIsRevealed(true);
    if (currentDisplayEntry?.id) {
      updateDpoEntryUserState(currentDisplayEntry.id, {
        isUserRevealed: true,
        userSelectedOptionKey: selectedOptionKey,
        userSelectedCategories: selectedCategories,
      });
    }
  }, [
    selectedOptionKey,
    selectedCategories,
    setLocalError,
    setIsRevealed,
    currentDisplayEntry,
    updateDpoEntryUserState,
  ]);

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

    if (!currentDisplayEntry || !currentDisplayEntry.id) {
      setLocalError('No current entry to submit evaluation for.');
      return;
    }

    submitEvaluationToContext(result, currentDisplayEntry);
    updateDpoEntryUserState(currentDisplayEntry.id, {
      isUserEvaluationSubmitted: true,
      userSelectedOptionKey: selectedOptionKey,
      userAgreementRating: agreementRating,
      userComment: userComment,
      userSelectedCategories: selectedCategories,
      isUserRevealed: true,
    });

    const isLastEntry = currentDpoEntryIndex === dpoEntriesToReview.length - 1;

    if (isLastEntry) {
      if (window.confirm('Are you sure you want to complete the survey?')) {
        completeSurveyAndPersistData();
      } else {
        window.alert('Now you can go back to previous step');
      }
    } else {
      goToNextStep();
    }
  }, [
    currentDisplayEntry,
    selectedOptionKey,
    agreementRating,
    userComment,
    optionAisDPOAccepted,
    selectedCategories,
    dpoEntriesToReview,
    currentDpoEntryIndex,
    timeStarted,
    submitEvaluationToContext,
    setLocalError,
    goToNextStep,
    completeSurveyAndPersistData,
    updateDpoEntryUserState,
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

  const canReveal: boolean = Boolean(
    selectedOptionKey &&
      selectedCategories.length > 0 &&
      !isRevealed &&
      !currentDisplayEntry?.isUserEvaluationSubmitted,
  );
  const canSubmit: boolean = Boolean(
    selectedOptionKey && agreementRating > 0 && isRevealed && !currentDisplayEntry?.isUserEvaluationSubmitted,
  );

  const researcherOptionKey = optionAisDPOAccepted ? 'A' : 'B';
  const userChoiceMatchesResearcher =
    (isRevealed || (currentDisplayEntry?.isUserEvaluationSubmitted ?? false)) &&
    selectedOptionKey === researcherOptionKey;

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
          isCurrentEvaluationSubmitted={currentDisplayEntry?.isUserEvaluationSubmitted || false}
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
          setAgreementRating={handleSetAgreementRating}
          setUserComment={handleSetUserComment}
          setSelectedCategories={handleSetSelectedCategories}
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
