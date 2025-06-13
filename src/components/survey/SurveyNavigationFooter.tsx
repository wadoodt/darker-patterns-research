// components/survey/SurveyNavigationFooter.tsx
'use client';
import { Button } from '@/components/ui/button';
import type { SurveyContextValue } from '@/types/survey';
import { ArrowLeft, ArrowRight, CheckCheck, Home, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useSurveyNavigationFooterLogic } from './useSurveyNavigationFooterLogic';

type NavigationProps = Pick<
  SurveyContextValue,
  | 'currentStepNumber'
  | 'goToNextStep'
  | 'goToPreviousStep'
  | 'saveDemographics'
  | 'completeSurveyAndPersistData'
  | 'isLoadingEntries'
  | 'isSubmittingSurvey'
  | 'isCurrentEvaluationSubmitted'
  | 'error'
  | 'surveyCompleted'
  | 'dpoEntriesToReview'
  | 'currentDpoEntryIndex'
> & {
  canProceedFromIntro: boolean;
  canProceedFromDemographics: boolean;
  isLastEntryInBatch: boolean;
};

// Extract button rendering into pure functions for clarity and separation
function renderLeftButton({
  currentStepNumber,
  goToPreviousStep,
  isLoadingEntries,
  isSubmittingSurvey,
}: Pick<NavigationProps, 'currentStepNumber' | 'goToPreviousStep' | 'isLoadingEntries' | 'isSubmittingSurvey'>) {
  if (currentStepNumber === 1) {
    return (
      <Button variant="link" size="sm" asChild className="btn-link-light px-1 text-xs">
        <Link href="/">
          {' '}
          <Home size={14} className="mr-1" /> Back to Home
        </Link>
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={goToPreviousStep}
      disabled={isLoadingEntries || isSubmittingSurvey}
      className="hover:bg-gray-100"
    >
      <ArrowLeft size={16} className="mr-1" /> Previous Step
    </Button>
  );
}

function renderRightButton(logic: NavigationProps) {
  const {
    currentStepNumber,
    goToNextStep,
    saveDemographics,
    completeSurveyAndPersistData,
    isLoadingEntries,
    isSubmittingSurvey,
    isCurrentEvaluationSubmitted,
    error,
    surveyCompleted,
    canProceedFromIntro,
    canProceedFromDemographics,
    dpoEntriesToReview,
    currentDpoEntryIndex,
    isLastEntryInBatch,
  } = logic;

  // Disable the button if there's an error or if we're loading/submitting
  const isDisabled =
    !!error ||
    isLoadingEntries ||
    isSubmittingSurvey ||
    (currentStepNumber === 1 && !canProceedFromIntro) ||
    (currentStepNumber === 2 && !canProceedFromDemographics) ||
    (currentStepNumber === 3 && !isCurrentEvaluationSubmitted);

  let buttonText = 'Next Step';
  let buttonIcon = <ArrowRight size={16} className="ml-1" />;
  let onClick = goToNextStep;

  // Handle special cases for different steps
  if (currentStepNumber === 2) {
    buttonText = 'Start Evaluation';
    onClick = saveDemographics;
  } else if (currentStepNumber === 3) {
    const isLastEntry = currentDpoEntryIndex === dpoEntriesToReview.length - 1;
    if (isLastEntry || isLastEntryInBatch) {
      buttonText = 'Complete Survey';
      buttonIcon = <CheckCheck size={16} className="ml-1" />;
      onClick = completeSurveyAndPersistData;
    } else {
      buttonText = 'Next Entry';
    }
  }

  if (isLoadingEntries || isSubmittingSurvey) {
    buttonIcon = <Loader2 size={16} className="ml-1 animate-spin" />;
  }

  if (surveyCompleted) {
    return null;
  }

  return (
    <Button variant="default" size="sm" onClick={onClick} disabled={isDisabled}>
      {buttonText}
      {buttonIcon}
    </Button>
  );
}

const SurveyNavigationFooter = () => {
  const logic = useSurveyNavigationFooterLogic();
  return (
    <footer className="survey-navigation-footer">
      <div className="survey-navigation-container">
        {renderLeftButton(logic)}
        {renderRightButton(logic)}
      </div>
    </footer>
  );
};

export default SurveyNavigationFooter;
