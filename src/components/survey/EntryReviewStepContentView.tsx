import type { DPOEntry } from '@/types/dpo';
import type React from 'react';
import CommentsSection from './CommentsSection';
import ErrorMessages from './ErrorMessages';
import FlagEntryModal from './FlagEntryModal';
import InstructionCard from './InstructionCard';
import OptionsSection from './OptionsSection';
import RatingSection from './RatingSection';
import RevealSection from './RevealSection';
import ReviewHeader from './ReviewHeader';
import SubmitButton from './SubmitButton';

interface Option {
  key: 'A' | 'B';
  content: string;
  isDatasetAccepted: boolean;
}

interface EntryReviewStepContentViewProps {
  // Data
  currentDisplayEntry: DPOEntry | null;
  currentDpoEntryIndex: number;
  dpoEntriesToReview: DPOEntry[];
  currentStepNumber: number;
  totalSteps: number;
  isLoadingEntries: boolean;
  isCurrentEvaluationSubmitted: boolean;
  selectedOptionKey: 'A' | 'B' | null;
  userRating: number;
  userComment: string;
  localError: string | null;
  contextError: string | null;
  isFlagModalOpen: boolean;
  canSubmitLocal: boolean;
  userChoseCorrectlyIfRevealed: boolean;
  optionAContent: string;
  optionBContent: string;
  optionAisDPOAccepted: boolean;
  // Handlers
  handleOptionSelect: (optionKey: 'A' | 'B') => void;
  setUserRating: (rating: number) => void;
  setUserComment: (comment: string) => void;
  handleLocalSubmitAndReveal: () => void;
  setIsFlagModalOpen: (open: boolean) => void;
  handleSubmitFlag: (reason: string, comment: string) => void;
}

const EntryReviewStepContentView: React.FC<EntryReviewStepContentViewProps> = (props) => {
  const {
    currentDisplayEntry,
    currentDpoEntryIndex,
    dpoEntriesToReview,
    currentStepNumber,
    totalSteps,
    isLoadingEntries,
    isCurrentEvaluationSubmitted,
    selectedOptionKey,
    userRating,
    userComment,
    localError,
    contextError,
    isFlagModalOpen,
    canSubmitLocal,
    userChoseCorrectlyIfRevealed,
    optionAContent,
    optionBContent,
    optionAisDPOAccepted,
    handleOptionSelect,
    setUserRating,
    setUserComment,
    handleLocalSubmitAndReveal,
    setIsFlagModalOpen,
    handleSubmitFlag,
  } = props;

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

  const options: Option[] = [
    { key: 'A', content: optionAContent, isDatasetAccepted: optionAisDPOAccepted },
    { key: 'B', content: optionBContent, isDatasetAccepted: !optionAisDPOAccepted },
  ];

  return (
    <div className="survey-page-container max-w-3xl">
      <ReviewHeader
        currentDpoEntryIndex={currentDpoEntryIndex}
        dpoEntriesToReview={dpoEntriesToReview}
        currentStepNumber={currentStepNumber}
        totalSteps={totalSteps}
      />
      <InstructionCard
        instruction={currentDisplayEntry.instruction}
        isCurrentEvaluationSubmitted={isCurrentEvaluationSubmitted}
        setIsFlagModalOpen={setIsFlagModalOpen}
      />
      <OptionsSection
        options={options}
        selectedOptionKey={selectedOptionKey}
        isCurrentEvaluationSubmitted={isCurrentEvaluationSubmitted}
        handleOptionSelect={handleOptionSelect}
        userChoseCorrectlyIfRevealed={userChoseCorrectlyIfRevealed}
      />
      <RatingSection
        selectedOptionKey={selectedOptionKey}
        isCurrentEvaluationSubmitted={isCurrentEvaluationSubmitted}
        userRating={userRating}
        setUserRating={setUserRating}
      />
      <CommentsSection
        selectedOptionKey={selectedOptionKey}
        userRating={userRating}
        isCurrentEvaluationSubmitted={isCurrentEvaluationSubmitted}
        userComment={userComment}
        setUserComment={setUserComment}
      />
      <ErrorMessages
        localError={localError}
        contextError={contextError}
        isCurrentEvaluationSubmitted={isCurrentEvaluationSubmitted}
      />
      <SubmitButton
        isCurrentEvaluationSubmitted={isCurrentEvaluationSubmitted}
        selectedOptionKey={selectedOptionKey}
        userRating={userRating}
        handleLocalSubmitAndReveal={handleLocalSubmitAndReveal}
        canSubmitLocal={canSubmitLocal}
        isLoadingEntries={isLoadingEntries}
      />
      <RevealSection
        isCurrentEvaluationSubmitted={isCurrentEvaluationSubmitted}
        currentDisplayEntry={currentDisplayEntry}
        selectedOptionKey={selectedOptionKey}
        userChoseCorrectlyIfRevealed={userChoseCorrectlyIfRevealed}
        dpoEntriesToReview={dpoEntriesToReview}
        currentDpoEntryIndex={currentDpoEntryIndex}
      />
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

export default EntryReviewStepContentView;
