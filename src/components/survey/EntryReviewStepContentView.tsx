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

const LoadingEntries = () => (
  <div className="survey-page-container p-10 text-center">
    <p className="text-gray-600">Loading evaluation entries...</p>
  </div>
);

const NoEntriesMessage = () => (
  <div className="survey-page-container p-10 text-center">
    <p className="mb-4 text-gray-600">No entries available for review.</p>
    <p className="text-sm text-gray-500">Please check back later or contact support if you believe this is an error.</p>
  </div>
);

const EntryReviewStepContentView: React.FC<EntryReviewStepContentViewProps> = (props) => {
  if (props.isLoadingEntries && !props.currentDisplayEntry) {
    return <LoadingEntries />;
  }
  if (!props.currentDisplayEntry) {
    return <NoEntriesMessage />;
  }

  const options: Option[] = [
    { key: 'A', content: props.optionAContent, isDatasetAccepted: props.optionAisDPOAccepted },
    { key: 'B', content: props.optionBContent, isDatasetAccepted: !props.optionAisDPOAccepted },
  ];

  return (
    <div className="survey-page-container max-w-3xl">
      <ReviewHeader
        currentDpoEntryIndex={props.currentDpoEntryIndex}
        dpoEntriesToReview={props.dpoEntriesToReview}
        currentStepNumber={props.currentStepNumber}
        totalSteps={props.totalSteps}
      />
      <InstructionCard
        instruction={props.currentDisplayEntry.instruction}
        isCurrentEvaluationSubmitted={props.isCurrentEvaluationSubmitted}
        setIsFlagModalOpen={props.setIsFlagModalOpen}
      />
      <OptionsSection
        options={options}
        selectedOptionKey={props.selectedOptionKey}
        isCurrentEvaluationSubmitted={props.isCurrentEvaluationSubmitted}
        handleOptionSelect={props.handleOptionSelect}
        userChoseCorrectlyIfRevealed={props.userChoseCorrectlyIfRevealed}
      />
      <RatingSection
        selectedOptionKey={props.selectedOptionKey}
        isCurrentEvaluationSubmitted={props.isCurrentEvaluationSubmitted}
        userRating={props.userRating}
        setUserRating={props.setUserRating}
      />
      <CommentsSection
        selectedOptionKey={props.selectedOptionKey}
        userRating={props.userRating}
        isCurrentEvaluationSubmitted={props.isCurrentEvaluationSubmitted}
        userComment={props.userComment}
        setUserComment={props.setUserComment}
      />
      <ErrorMessages
        localError={props.localError}
        contextError={props.contextError}
        isCurrentEvaluationSubmitted={props.isCurrentEvaluationSubmitted}
      />
      <SubmitButton
        isCurrentEvaluationSubmitted={props.isCurrentEvaluationSubmitted}
        selectedOptionKey={props.selectedOptionKey}
        userRating={props.userRating}
        handleLocalSubmitAndReveal={props.handleLocalSubmitAndReveal}
        canSubmitLocal={props.canSubmitLocal}
        isLoadingEntries={props.isLoadingEntries}
      />
      <RevealSection
        isCurrentEvaluationSubmitted={props.isCurrentEvaluationSubmitted}
        currentDisplayEntry={props.currentDisplayEntry}
        selectedOptionKey={props.selectedOptionKey}
        userChoseCorrectlyIfRevealed={props.userChoseCorrectlyIfRevealed}
        dpoEntriesToReview={props.dpoEntriesToReview}
        currentDpoEntryIndex={props.currentDpoEntryIndex}
      />
      {props.currentDisplayEntry && (
        <FlagEntryModal
          isOpen={props.isFlagModalOpen}
          onClose={() => props.setIsFlagModalOpen(false)}
          onSubmitFlag={props.handleSubmitFlag}
          entryId={props.currentDisplayEntry.id}
        />
      )}
    </div>
  );
};

export default EntryReviewStepContentView;
