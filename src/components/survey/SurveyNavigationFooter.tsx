// components/survey/SurveyNavigationFooter.tsx
'use client';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, CheckCheck, Home, Loader2 } from 'lucide-react';
import Link from 'next/link'; // Keep Link for "Back to Home" type scenarios
import { useSurveyNavigationFooterLogic } from './useSurveyNavigationFooterLogic';

// Define a type for the logic object to avoid 'any' and unused variable warnings
interface SurveyNavigationFooterLogic {
  currentStepNumber: number;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
  saveDemographics: () => void;
  completeSurveyAndPersistData: () => void;
  isLoadingEntries: boolean;
  isSubmittingSurvey: boolean;
  isCurrentEvaluationSubmitted: boolean;
  contextError: string | null;
  surveyCompleted: boolean;
  canProceedFromIntro: boolean;
  canProceedFromDemographics: boolean;
  dpoEntriesToReview: { length: number };
  currentDpoEntryIndex: number;
  isLastEntryInBatch: boolean;
}

// Extract button rendering into pure functions for clarity and separation
function renderLeftButton({
  currentStepNumber,
  goToPreviousStep,
  isLoadingEntries,
  isSubmittingSurvey,
}: SurveyNavigationFooterLogic) {
  if (currentStepNumber === 1) {
    return (
      <Button variant="link" size="sm" asChild className="btn-link-light px-1 text-xs">
        <Link href="/">
          {' '}
          <Home size={14} className="mr-1" /> Back to Home
        </Link>
      </Button>
    );
  } else if (currentStepNumber === 2 || currentStepNumber === 3) {
    return (
      <Button
        onClick={goToPreviousStep}
        variant="outline"
        size="sm"
        className="btn-secondary-light text-xs"
        disabled={
          currentStepNumber === 3 ? isLoadingEntries || isSubmittingSurvey : isLoadingEntries || isSubmittingSurvey
        }
      >
        <ArrowLeft size={16} className="mr-1.5" /> Back
      </Button>
    );
  } else if (currentStepNumber === 4) {
    return (
      <Button variant="link" size="sm" asChild className="btn-link-light px-1 text-xs" disabled={isSubmittingSurvey}>
        <Link href="/">
          {' '}
          <Home size={14} className="mr-1" /> Return Home
        </Link>
      </Button>
    );
  }
  return null;
}

function renderCenterText({
  currentStepNumber,
  currentDpoEntryIndex,
  dpoEntriesToReview,
}: SurveyNavigationFooterLogic) {
  if (currentStepNumber === 3) {
    return (
      <p className="text-xs text-gray-500">
        Entry {Math.min(currentDpoEntryIndex + 1, dpoEntriesToReview.length)} of {dpoEntriesToReview.length}
      </p>
    );
  }
  return null;
}

function renderRightButton(props: SurveyNavigationFooterLogic) {
  const {
    currentStepNumber,
    goToNextStep,
    saveDemographics,
    completeSurveyAndPersistData,
    isLoadingEntries,
    isSubmittingSurvey,
    isCurrentEvaluationSubmitted,
    contextError,
    canProceedFromIntro,
    canProceedFromDemographics,
    isLastEntryInBatch,
    surveyCompleted,
  } = props;

  if (currentStepNumber === 1) {
    return (
      <Button
        onClick={goToNextStep}
        disabled={!canProceedFromIntro || isLoadingEntries || !!contextError}
        className="btn-primary-light btn-cta-light min-w-[140px] text-xs"
      >
        {isLoadingEntries ? <Loader2 className="mr-1.5 animate-spin" size={14} /> : 'Start Survey'}
        {!isLoadingEntries && <ArrowRight size={16} className="ml-1.5" />}
      </Button>
    );
  } else if (currentStepNumber === 2) {
    return (
      <Button
        onClick={saveDemographics}
        disabled={!canProceedFromDemographics || isLoadingEntries || !!contextError}
        className="btn-primary-light min-w-[100px] text-xs"
      >
        {isLoadingEntries ? <Loader2 className="mr-1.5 animate-spin" size={14} /> : 'Next'}
        {!isLoadingEntries && <ArrowRight size={16} className="ml-1.5" />}
      </Button>
    );
  } else if (currentStepNumber === 3) {
    return (
      <Button
        onClick={goToNextStep}
        disabled={!isCurrentEvaluationSubmitted || isLoadingEntries || !!contextError}
        className="btn-primary-light min-w-[120px] text-xs"
      >
        {isLoadingEntries && <Loader2 className="mr-1.5 animate-spin" size={14} />}
        {!isLoadingEntries && (isLastEntryInBatch ? 'Finish Evaluation' : 'Next Entry')}
        {!isLoadingEntries && <ArrowRight size={16} className="ml-1.5" />}
      </Button>
    );
  } else if (currentStepNumber === 4) {
    if (!surveyCompleted) {
      return (
        <Button
          onClick={completeSurveyAndPersistData}
          disabled={isSubmittingSurvey || !!contextError}
          className="btn-primary-light btn-cta-light min-w-[140px] text-xs"
        >
          {isSubmittingSurvey ? <Loader2 className="mr-1.5 animate-spin" size={14} /> : 'Finish & Submit'}
          {!isSubmittingSurvey && <CheckCheck size={16} className="ml-1.5" />}
        </Button>
      );
    } else {
      return (
        <Button disabled={true} className="btn-primary-light min-w-[140px] cursor-not-allowed text-xs opacity-70">
          <CheckCheck size={16} className="mr-1.5" /> Submitted
        </Button>
      );
    }
  }
  return null;
}

const SurveyNavigationFooter = () => {
  // Ensure canProceedFromIntro is always boolean
  const logicRaw = useSurveyNavigationFooterLogic();
  const logic: SurveyNavigationFooterLogic = {
    ...logicRaw,
    canProceedFromIntro: !!logicRaw.canProceedFromIntro,
    canProceedFromDemographics: !!logicRaw.canProceedFromDemographics,
  };
  return (
    <footer className="survey-nav-footer">
      <div className="flex w-1/3 justify-start">{renderLeftButton(logic)}</div>
      <div className="flex w-1/3 items-center justify-center text-center">{renderCenterText(logic)}</div>
      <div className="flex w-1/3 justify-end">{renderRightButton(logic)}</div>
    </footer>
  );
};
export default SurveyNavigationFooter;
