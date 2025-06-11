// components/survey/EntryReviewStepContent.tsx
'use client';
import type React from 'react';
import { useState, useEffect } from 'react';
import { useSurveyProgress } from '../../contexts/SurveyProgressContext';
import type { DPOEntry, EvaluationDraft } from '../../types/dpo'; // Ensure EvaluationDraft is imported
import {
  Info,
  Star,
  MessageSquare,
  CheckCircle2,
  XCircle,
  Flag,
  ThumbsUp,
  ThumbsDown,
  AlertTriangle,
} from 'lucide-react';
import FlagEntryModal from './FlagEntryModal';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { addDoc, collection, serverTimestamp, updateDoc, doc, increment } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const EntryReviewStepContent: React.FC<{ entryId?: string }> = ({ entryId: propEntryId }) => {
  const {
    currentStepNumber,
    totalSteps,
    getCurrentDpoEntry,
    submitEvaluation: submitEvaluationToContext,
    dpoEntriesToReview,
    currentDpoEntryIndex,
    isLoadingEntries,
    participantSessionUid,
    markCurrentEvaluationSubmitted,
    resetCurrentEvaluationSubmitted,
    isCurrentEvaluationSubmitted,
    error: contextError,
    setGlobalError,
    setHasUnsavedChanges, // For "unsaved changes"
  } = useSurveyProgress();

  const [currentDisplayEntry, setCurrentDisplayEntry] = useState<DPOEntry | null>(null);
  const [optionAContent, setOptionAContent] = useState<string>('');
  const [optionBContent, setOptionBContent] = useState<string>('');
  const [optionAisDPOAccepted, setOptionAisDPOAccepted] = useState<boolean>(false);

  const [selectedOptionKey, setSelectedOptionKey] = useState<'A' | 'B' | null>(null);
  const [userRating, setUserRating] = useState<number>(0);
  const [userComment, setUserComment] = useState<string>('');
  // isRevealed is now primarily driven by isCurrentEvaluationSubmitted from context
  const [timeStarted, setTimeStarted] = useState<number>(0);

  const [isFlagModalOpen, setIsFlagModalOpen] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    setGlobalError(null); // Clear any global errors when a new entry/step loads
    const entry = getCurrentDpoEntry();
    setCurrentDisplayEntry(entry);

    if (entry) {
      // Randomize which DPO response becomes Option A or Option B
      const isDatasetAcceptedRandomlyAssignedToA = Math.random() < 0.5;
      setOptionAContent(isDatasetAcceptedRandomlyAssignedToA ? entry.acceptedResponse : entry.rejectedResponse);
      setOptionBContent(isDatasetAcceptedRandomlyAssignedToA ? entry.rejectedResponse : entry.acceptedResponse);
      setOptionAisDPOAccepted(isDatasetAcceptedRandomlyAssignedToA); // True if Option A UI is the DPO's acceptedResponse

      // Reset local state for the new entry
      setSelectedOptionKey(null);
      setUserRating(0);
      setUserComment('');
      setTimeStarted(Date.now());
      resetCurrentEvaluationSubmitted(); // This sets isCurrentEvaluationSubmitted to false and hasUnsavedChanges to true
      setLocalError(null);
    } else {
      // No entry, no unsaved changes for this specific step's content
      setHasUnsavedChanges(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentDpoEntryIndex, getCurrentDpoEntry]); // resetCurrentEvaluationSubmitted, setGlobalError, setHasUnsavedChanges removed as per lint

  // Effect to signal unsaved changes when form fields change before submission
  useEffect(() => {
    if (currentDisplayEntry && !isCurrentEvaluationSubmitted && (selectedOptionKey || userRating > 0 || userComment)) {
      setHasUnsavedChanges(true);
    }
  }, [
    selectedOptionKey,
    userRating,
    userComment,
    currentDisplayEntry,
    isCurrentEvaluationSubmitted,
    setHasUnsavedChanges,
  ]);

  const handleOptionSelect = (optionKey: 'A' | 'B') => {
    if (isCurrentEvaluationSubmitted) return;
    setSelectedOptionKey(optionKey);
    setLocalError(null);
  };

  const handleLocalSubmitAndReveal = () => {
    setLocalError(null);
    if (!selectedOptionKey) {
      setLocalError('Please select either Option A or Option B.');
      return;
    }
    if (userRating === 0) {
      setLocalError('Please provide a rating (1-5 stars) for your choice.');
      return;
    }
    if (!currentDisplayEntry || !currentDisplayEntry.id) {
      setGlobalError('Error: No entry loaded to submit. Please refresh or contact support.');
      return;
    }

    const timeSpentMs = Date.now() - timeStarted;
    const chosenOptionWasDatasetAccepted =
      (selectedOptionKey === 'A' && optionAisDPOAccepted) || (selectedOptionKey === 'B' && !optionAisDPOAccepted);

    const evaluationDraft: EvaluationDraft = {
      dpoEntryId: currentDisplayEntry.id,
      chosenOptionKey: selectedOptionKey,
      rating: userRating,
      comment: userComment.trim(),
      timeSpentMs: timeSpentMs,
      wasChosenActuallyAccepted: chosenOptionWasDatasetAccepted,
    };

    submitEvaluationToContext(evaluationDraft); // Saves to context's evaluations array
    markCurrentEvaluationSubmitted(); // Sets isCurrentEvaluationSubmitted to true, hasUnsavedChanges to false
  };

  const handleSubmitFlag = async (reason: string, comment: string) => {
    if (!currentDisplayEntry || !currentDisplayEntry.id || !participantSessionUid) {
      alert('Cannot submit flag: missing entry data or session information.');
      return;
    }
    if (process.env.NODE_ENV === 'test' || !db) {
      // console.warn("Flag submission skipped: Test mode or DB not available.");
      alert('Flagging is currently simulated. Your feedback is noted.');
      setIsFlagModalOpen(false);
      return;
    }

    const flagData = {
      participantSessionUid,
      reason,
      comment: comment.trim() || null,
      flaggedAt: serverTimestamp(),
      dpoEntryCategory: currentDisplayEntry.category,
    };
    const entryDocRef = doc(db, 'dpo_entries', currentDisplayEntry.id);
    const flagsCollectionRef = collection(entryDocRef, 'participant_flags');

    try {
      await addDoc(flagsCollectionRef, flagData);
      // For MVP, client-side increment is okay with security rules.
      // Production: Firebase Function to handle this to avoid race conditions if many users flag simultaneously.
      await updateDoc(entryDocRef, {
        isFlaggedCount: increment(1),
        lastFlaggedAt: serverTimestamp(),
      });
      alert('Entry flagged successfully. Thank you for your feedback.');
    } catch (error: any) {
      console.error('Error submitting flag:', error);
      alert(`Failed to submit flag. Error: ${error.message || 'Unknown error'}`);
    } finally {
      setIsFlagModalOpen(false);
    }
  };

  if (isLoadingEntries && !currentDisplayEntry) {
    return (
      <div className="survey-page-container p-10 text-center">
        <p className="text-gray-600">Loading evaluation entries...</p>
      </div>
    );
  }
  if (!currentDisplayEntry) {
    return (
      <div className="survey-page-container p-10 text-center">
        <p className="mb-4 text-gray-600">No more entries to display for this session.</p>
        <p className="text-sm text-gray-500">
          You might have completed all assigned entries, or an error occurred. Please use the navigation below to
          proceed.
        </p>
      </div>
    );
  }

  const canSubmitLocal = selectedOptionKey && userRating > 0;
  const userChoseCorrectlyIfRevealed =
    isCurrentEvaluationSubmitted &&
    ((selectedOptionKey === 'A' && optionAisDPOAccepted) || (selectedOptionKey === 'B' && !optionAisDPOAccepted));

  return (
    <div className="survey-page-container max-w-3xl">
      <div className="survey-step-title-container mb-2 text-center">
        <p className="survey-step-indicator">
          Entry {Math.min(currentDpoEntryIndex + 1, dpoEntriesToReview.length)} of {dpoEntriesToReview.length}
          <span className="mx-1 text-gray-400">|</span>
          Step {currentStepNumber} of {totalSteps}
        </p>
        <h2 className="survey-main-title !text-2xl">Evaluate AI Responses</h2>
      </div>

      <section aria-labelledby="instruction-title" className="entry-instruction-card mb-5">
        <div className="mb-1.5 flex items-center justify-between">
          <h3 id="instruction-title" className="survey-section-title flex items-center !text-base !font-semibold">
            <Info size={18} className="text-brand-purple-600 mr-1.5" />
            Instruction:
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsFlagModalOpen(true)}
            title="Flag this entry for review"
            className="h-auto px-2 py-1 text-xs text-gray-500 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
            disabled={isCurrentEvaluationSubmitted}
          >
            <Flag size={12} className="mr-1" /> Flag Entry
          </Button>
        </div>
        <div
          className="entry-instruction-text prose prose-sm max-w-none text-gray-700"
          dangerouslySetInnerHTML={{ __html: currentDisplayEntry.instruction.replace(/\n/g, '<br/>') }}
        />
      </section>

      <section aria-labelledby="options-title" className="mb-5">
        <h3 id="options-title" className="survey-section-title mb-3 text-center !text-base !font-semibold">
          Which response do you prefer for the instruction above?
        </h3>
        <div className="option-selection-container">
          {[
            { key: 'A', content: optionAContent, isDatasetAccepted: optionAisDPOAccepted },
            { key: 'B', content: optionBContent, isDatasetAccepted: !optionAisDPOAccepted },
          ].map((opt) => (
            <div
              key={opt.key}
              onClick={() => !isCurrentEvaluationSubmitted && handleOptionSelect(opt.key as 'A' | 'B')}
              className={cn(
                'option-card-button flex flex-col',
                selectedOptionKey === opt.key && !isCurrentEvaluationSubmitted && 'selected',
                isCurrentEvaluationSubmitted && 'cursor-not-allowed opacity-80', // General disabled appearance when revealed
                isCurrentEvaluationSubmitted &&
                  selectedOptionKey === opt.key &&
                  userChoseCorrectlyIfRevealed &&
                  'border-green-500 ring-2 ring-green-500',
                isCurrentEvaluationSubmitted &&
                  selectedOptionKey === opt.key &&
                  !userChoseCorrectlyIfRevealed &&
                  'border-red-500 ring-2 ring-red-500',
              )}
              role="button"
              tabIndex={isCurrentEvaluationSubmitted ? -1 : 0}
              aria-pressed={selectedOptionKey === opt.key}
            >
              <span className="option-card-label">Option {opt.key}</span>
              <div
                className="option-card-content prose prose-sm max-w-none flex-grow text-gray-700"
                dangerouslySetInnerHTML={{ __html: opt.content.replace(/\n/g, '<br/>') }}
              />
              {isCurrentEvaluationSubmitted &&
                selectedOptionKey === opt.key && ( // Only show researcher choice for the selected option
                  <div
                    className={cn(
                      'reveal-status-badge -mx-3 mt-auto -mb-3 flex items-center justify-center gap-1.5 rounded-b-md py-1.5 pt-2 text-xs font-medium',
                      opt.isDatasetAccepted ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700',
                    )}
                  >
                    {opt.isDatasetAccepted ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                    Researchers' {opt.isDatasetAccepted ? 'Preferred' : 'Less Preferred'} Choice
                  </div>
                )}
            </div>
          ))}
        </div>
      </section>

      {selectedOptionKey && !isCurrentEvaluationSubmitted && (
        <section aria-labelledby="rating-title" className="survey-section-card mb-5 p-4">
          <h3 id="rating-title" className="survey-section-title mb-2.5 text-center !text-base !font-semibold">
            How confident are you in your choice? (1-5 Stars)
          </h3>
          <div className="star-rating-container">
            {[1, 2, 3, 4, 5].map(
              (
                starValue, // Order 1 to 5 for display
              ) => (
                <React.Fragment key={starValue}>
                  <input
                    type="radio"
                    id={`star${starValue}`}
                    name="rating"
                    value={starValue}
                    checked={userRating === starValue}
                    onChange={() => setUserRating(starValue)}
                    className="star-rating-input"
                    disabled={isCurrentEvaluationSubmitted}
                  />
                  <label htmlFor={`star${starValue}`} className="star-rating-label" title={`${starValue} stars`}>
                    <Star fill={userRating >= starValue ? 'currentColor' : 'none'} strokeWidth={1.5} />
                  </label>
                </React.Fragment>
              ),
            )}
          </div>
        </section>
      )}

      {selectedOptionKey && userRating > 0 && !isCurrentEvaluationSubmitted && (
        <section aria-labelledby="comments-title" className="survey-section-card mb-5 p-4">
          <h3 id="comments-title" className="survey-section-title mb-2 flex items-center !text-base !font-semibold">
            <MessageSquare size={18} className="text-brand-purple-600 mr-1.5" />
            Optional Comments
          </h3>
          <Textarea
            id="userComment"
            name="userComment"
            className="form-textarea-light w-full text-xs"
            placeholder="Add any comments about your choice, the instruction, or the responses (e.g., if both are bad, or if one is slightly better)..."
            value={userComment}
            onChange={(e) => setUserComment(e.target.value)}
            rows={3}
            disabled={isCurrentEvaluationSubmitted}
          />
        </section>
      )}

      {localError && !isCurrentEvaluationSubmitted && (
        <div className="my-4 flex items-center gap-2 rounded-md border border-red-300 bg-red-50 p-3 text-xs text-red-600">
          <AlertTriangle size={16} /> {localError}
        </div>
      )}
      {contextError && (
        <div className="my-4 flex items-center gap-2 rounded-md border border-red-300 bg-red-50 p-3 text-xs text-red-600">
          <AlertTriangle size={16} /> {contextError}
        </div>
      )}

      {!isCurrentEvaluationSubmitted && selectedOptionKey && userRating > 0 && (
        <div className="mt-1 mb-5 text-center">
          <Button
            onClick={handleLocalSubmitAndReveal}
            disabled={!canSubmitLocal || isLoadingEntries}
            className="btn-primary-light min-w-[220px] px-6 py-2.5 text-sm"
          >
            Submit Evaluation &amp; See Rationale
          </Button>
        </div>
      )}

      {isCurrentEvaluationSubmitted && currentDisplayEntry && (
        <section aria-labelledby="reveal-title" className="reveal-section survey-section-card visible mt-2 p-4 sm:p-5">
          <h3 id="reveal-title" className="survey-section-title mb-3 text-center !text-base !font-semibold">
            Results &amp; Rationale for Entry:{' '}
            <span className="font-mono text-xs">{currentDisplayEntry.id.substring(0, 12)}...</span>
          </h3>
          <div className="space-y-3 text-sm text-gray-700">
            <p
              className={cn(
                'flex items-center gap-2 rounded-md p-2 text-xs sm:text-sm',
                userChoseCorrectlyIfRevealed ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700',
              )}
            >
              {userChoseCorrectlyIfRevealed ? <ThumbsUp size={16} /> : <ThumbsDown size={16} />}
              You chose:{' '}
              <strong className="font-semibold">{selectedOptionKey === 'A' ? 'Option A' : 'Option B'}</strong>. This was
              the{' '}
              <strong className="font-semibold">
                {userChoseCorrectlyIfRevealed
                  ? "researchers' preferred choice."
                  : 'less preferred choice by researchers.'}
              </strong>
            </p>
            {currentDisplayEntry.discussion && (
              <div>
                <h4 className="font-lora mt-3 mb-1 text-sm font-semibold text-gray-800">Researcher's Rationale:</h4>
                <div
                  className="reveal-discussion-text prose prose-sm max-w-none text-xs text-gray-600"
                  dangerouslySetInnerHTML={{ __html: currentDisplayEntry.discussion.replace(/\n/g, '<br/>') }}
                />
              </div>
            )}
            <div className="mt-3 space-y-2 text-xs">
              <details className="reveal-details-box rounded border border-green-300 bg-green-50/50 p-2">
                <summary className="cursor-pointer font-semibold text-green-700 hover:underline">
                  Show Researchers' Preferred Response
                </summary>
                <div
                  className="prose prose-xs mt-1.5 max-w-none border-t border-green-200 pt-1.5 text-gray-600"
                  dangerouslySetInnerHTML={{ __html: currentDisplayEntry.acceptedResponse.replace(/\n/g, '<br/>') }}
                />
              </details>
              <details className="reveal-details-box rounded border border-red-300 bg-red-50/50 p-2">
                <summary className="cursor-pointer font-semibold text-red-700 hover:underline">
                  Show Researchers' Less Preferred Response
                </summary>
                <div
                  className="prose prose-xs mt-1.5 max-w-none border-t border-red-200 pt-1.5 text-gray-600"
                  dangerouslySetInnerHTML={{ __html: currentDisplayEntry.rejectedResponse.replace(/\n/g, '<br/>') }}
                />
              </details>
            </div>
            <p className="mt-4 text-center text-xs text-gray-500">
              {currentDpoEntryIndex < dpoEntriesToReview.length - 1
                ? "Click 'Next Entry' below to continue."
                : "All entries evaluated! Click 'Finish Evaluation' below."}
            </p>
          </div>
        </section>
      )}

      {currentDisplayEntry && (
        <FlagEntryModal
          isOpen={isFlagModalOpen}
          onClose={() => setIsFlagModalOpen(false)}
          onSubmitFlag={handleSubmitFlag}
          entryId={currentDisplayEntry.id}
        />
      )}
    </div>
  );
};

export default EntryReviewStepContent;
