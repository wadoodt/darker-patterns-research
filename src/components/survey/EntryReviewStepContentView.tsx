/* eslint-disable max-lines-per-function */
import type { DPOEntry, DPOOption } from '@/types/dpo';
import type React from 'react';
import CategoriesSection from './CategoriesSection';
import CommentsSection from './CommentsSection';
import ErrorMessages from './ErrorMessages';
import FlagEntryModal from './FlagEntryModal';
import InstructionCard from './InstructionCard';
import OptionsSection from './OptionsSection';
import RatingSection from './RatingSection';
import RevealSection from './RevealSection';
import ReviewHeader from './ReviewHeader';
import SubmitButton from './SubmitButton';

interface EntryReviewStepContentViewProps {
  currentDisplayEntry: DPOEntry | null;
  currentDpoEntryIndex: number;
  dpoEntriesToReview: DPOEntry[];
  currentStepNumber: number;
  totalSteps: number;
  isLoadingEntries: boolean;
  isCurrentEvaluationSubmitted: boolean;
  isRevealed: boolean;
  selectedOptionKey: 'A' | 'B' | null;
  agreementRating: number;
  userComment: string;
  selectedCategories: string[];
  localError: string | null;
  contextError: string | null;
  isFlagModalOpen: boolean;
  canReveal: boolean;
  canSubmit: boolean;
  userChoiceMatchesResearcher: boolean;
  researcherOptionKey: 'A' | 'B';
  optionAContent: string;
  optionBContent: string;
  handleOptionSelect: (optionKey: 'A' | 'B') => void;
  setAgreementRating: (rating: number) => void;
  setUserComment: (comment: string) => void;
  setSelectedCategories: (categories: string[]) => void;
  handleReveal: () => void;
  handleLocalSubmit: () => void;
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

  const isUIBlocked = props.isRevealed || props.isCurrentEvaluationSubmitted;

  const options: DPOOption[] = [
    {
      key: 'A',
      content: props.optionAContent,
      isDatasetAccepted: props.researcherOptionKey === 'A',
    },
    {
      key: 'B',
      content: props.optionBContent,
      isDatasetAccepted: props.researcherOptionKey === 'B',
    },
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
        handleOptionSelect={props.handleOptionSelect}
        isUIBlocked={isUIBlocked}
        isRevealed={props.isRevealed}
        researcherOptionKey={props.researcherOptionKey}
      />
      <CategoriesSection
        selectedCategories={props.selectedCategories}
        setSelectedCategories={props.setSelectedCategories}
        isUIBlocked={isUIBlocked}
        isRevealed={props.isRevealed}
        researcherCategories={props.currentDisplayEntry.researcherCategories}
      />

      <ErrorMessages
        localError={props.localError}
        contextError={props.contextError}
        isCurrentEvaluationSubmitted={props.isCurrentEvaluationSubmitted}
      />

      {!isUIBlocked && (
        <SubmitButton
          text="Compare with Researchers"
          onClick={props.handleReveal}
          disabled={!props.canReveal || props.isLoadingEntries}
          isLoading={props.isLoadingEntries}
          dataTour="reveal-button"
        />
      )}

      {props.isRevealed && (
        <RevealSection
          isRevealed={props.isRevealed}
          isCurrentEvaluationSubmitted={props.isCurrentEvaluationSubmitted}
          currentDisplayEntry={props.currentDisplayEntry}
          selectedOptionKey={props.selectedOptionKey}
          userChoseCorrectlyIfRevealed={props.userChoiceMatchesResearcher}
          dpoEntriesToReview={props.dpoEntriesToReview}
          currentDpoEntryIndex={props.currentDpoEntryIndex}
        />
      )}

      {props.isRevealed && !props.isCurrentEvaluationSubmitted && (
        <>
          <RatingSection
            agreementRating={props.agreementRating}
            setAgreementRating={props.setAgreementRating}
            isUIBlocked={props.isCurrentEvaluationSubmitted}
          />
          <CommentsSection
            userComment={props.userComment}
            setUserComment={props.setUserComment}
            isUIBlocked={props.isCurrentEvaluationSubmitted}
          />
          <SubmitButton
            text="Submit Evaluation"
            onClick={props.handleLocalSubmit}
            disabled={!props.canSubmit || props.isLoadingEntries}
            isLoading={props.isLoadingEntries}
            dataTour="submit-button"
          />
        </>
      )}

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
