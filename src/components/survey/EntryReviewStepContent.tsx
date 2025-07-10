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
    // markCurrentEvaluationSubmitted, // <--- Consider removing, handled by SET_EVALUATION now
    isCurrentEvaluationSubmitted,
    error: contextError,
    goToNextStep,
    completeSurveyAndPersistData,
    currentDisplayEntry,
    // --- ADD updateDpoEntryUserState HERE ---
    updateDpoEntryUserState,
  } = useSurveyProgress(); // This is where updateDpoEntryUserState comes from

  const {
    optionAContent,
    optionBContent,
    optionAisDPOAccepted,
    selectedOptionKey,
    setSelectedOptionKey,
    agreementRating,
    setAgreementRating, // Still needed for local state update by handleSetAgreementRating
    userComment,
    setUserComment, // Still needed for local state update by handleSetUserComment
    selectedCategories,
    setSelectedCategories, // Still needed for local state update by handleSetSelectedCategories
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
    if (currentDisplayEntry?.id && currentDpoEntryIndex === 0 && !isCurrentEvaluationSubmitted && shouldShowTour) {
      // Small delay to ensure DOM is ready
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
      // It's crucial to check isUserEvaluationSubmitted from currentDisplayEntry
      // because isCurrentEvaluationSubmitted might be for the previous entry.
      if (currentDisplayEntry?.isUserEvaluationSubmitted || isRevealed) return; // Use currentDisplayEntry's state for this
      setSelectedOptionKey(optionKey);
      setLocalError(null);
      if (currentDisplayEntry?.id) {
        updateDpoEntryUserState(currentDisplayEntry.id, { userSelectedOptionKey: optionKey });
      }
    },
    [currentDisplayEntry, isRevealed, setSelectedOptionKey, setLocalError, updateDpoEntryUserState], // Add currentDisplayEntry and updateDpoEntryUserState to dependencies
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

    // Always use currentDisplayEntry directly, as it's kept up-to-date by the reducer
    // and correctly reflects the current entry being displayed.
    if (!currentDisplayEntry || !currentDisplayEntry.id) {
      // Use currentDisplayEntry.id for validation
      setLocalError('No current entry to submit evaluation for.');
      return;
    }

    submitEvaluationToContext(result, currentDisplayEntry); // Pass currentDisplayEntry directly

    // markCurrentEvaluationSubmitted(); // <--- This line is likely no longer needed.
    // The SET_EVALUATION action in reducer now handles
    // marking isUserEvaluationSubmitted: true on the DPOEntry
    // and useEntryReviewState will pick it up.

    // Redundant but safe: Ensure the DPOEntry in state reflects the submitted state.
    // The SET_EVALUATION action in the reducer already handles this robustly,
    // but an explicit dispatch here can act as a fallback/reinforcement.
    // If you're confident in the SET_EVALUATION reducer logic, you could omit this block.
    // However, it doesn't hurt.
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
      completeSurveyAndPersistData();
    } else {
      goToNextStep();
    }
  }, [
    currentDisplayEntry, // Crucial dependency for all these changes
    selectedOptionKey,
    agreementRating,
    userComment,
    timeStarted,
    optionAisDPOAccepted,
    selectedCategories,
    dpoEntriesToReview, // Needed for `isLastEntry` check
    currentDpoEntryIndex, // Needed for `isLastEntry` check
    submitEvaluationToContext,
    setLocalError,
    goToNextStep,
    completeSurveyAndPersistData,
    updateDpoEntryUserState, // New dependency
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

  // canReveal and canSubmit can also check currentDisplayEntry.isUserEvaluationSubmitted
  // if you want to prevent actions on already submitted entries.
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
  // userChoiceMatchesResearcher should also look at currentDisplayEntry.isUserEvaluationSubmitted
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
          // The prop passed here should reflect the current entry's submission status
          // which is now primarily driven by currentDisplayEntry.isUserEvaluationSubmitted
          isCurrentEvaluationSubmitted={currentDisplayEntry?.isUserEvaluationSubmitted || false} // <--- IMPORTANT CHANGE
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
          // --- PASS NEW HANDLERS TO CONTENT VIEW ---
          setAgreementRating={handleSetAgreementRating} // Use new handler
          setUserComment={handleSetUserComment} // Use new handler
          setSelectedCategories={handleSetSelectedCategories} // Use new handler
          // --- END NEW HANDLERS ---
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
