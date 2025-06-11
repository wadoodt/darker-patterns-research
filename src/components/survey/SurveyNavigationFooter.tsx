// components/survey/SurveyNavigationFooter.tsx
'use client';
import React from 'react';
import Link from 'next/link'; // Keep Link for "Back to Home" type scenarios
import { useSurveyProgress } from '../../contexts/SurveyProgressContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, CheckCheck, Home, Loader2 } from 'lucide-react';
// useRouter not strictly needed here if all navigation is through context or Link
// import { useRouter } from 'next/navigation';

const SurveyNavigationFooter = () => {
  // const router = useRouter(); // Only if needed for direct navigation not covered by context
  const {
    currentStepNumber,
    goToNextStep,
    goToPreviousStep,
    saveDemographics,
    completeSurveyAndPersistData,
    participationType,
    participantEmail,
    termsAgreed,
    demographicsData,
    dpoEntriesToReview,
    currentDpoEntryIndex,
    isLoadingEntries,
    isSubmittingSurvey, // This is for the final persistence
    isCurrentEvaluationSubmitted,
    error: contextError,
    surveyCompleted, // To know if final submission was successful
  } = useSurveyProgress();

  let leftButton: React.ReactNode = null;
  let rightButton: React.ReactNode = null;
  let centerText: React.ReactNode = null;

  // Validation for Introduction Step (Step 1)
  const canProceedFromIntro =
    participationType &&
    termsAgreed &&
    (participationType === 'anonymous' ||
      (participationType === 'email' && !!participantEmail && /\S+@\S+\.\S+/.test(participantEmail)));

  // Validation for Demographics Step (Step 2)
  const isDemographicsFormValid = () => {
    if (!demographicsData) return false;
    const {
      ageGroup,
      gender,
      genderOther,
      educationLevel,
      educationOther,
      fieldOfExpertise,
      expertiseOther,
      aiFamiliarity,
    } = demographicsData;
    if (!ageGroup || !gender || !educationLevel || !fieldOfExpertise || !aiFamiliarity) return false;
    if (gender === 'Prefer to self-describe' && !genderOther?.trim()) return false;
    if (educationLevel === 'Other' && !educationOther?.trim()) return false;
    if (fieldOfExpertise === 'Other' && !expertiseOther?.trim()) return false;
    return true;
  };
  const canProceedFromDemographics = isDemographicsFormValid();

  if (currentStepNumber === 1) {
    // Introduction
    leftButton = (
      <Button variant="link" size="sm" asChild className="btn-link-light px-1 text-xs">
        <Link href="/">
          {' '}
          <Home size={14} className="mr-1" /> Back to Home
        </Link>
      </Button>
    );
    rightButton = (
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
    // Demographics
    leftButton = (
      <Button
        onClick={goToPreviousStep}
        variant="outline"
        size="sm"
        className="btn-secondary-light text-xs"
        disabled={isLoadingEntries || isSubmittingSurvey}
      >
        <ArrowLeft size={16} className="mr-1.5" /> Back
      </Button>
    );
    rightButton = (
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
    // Evaluation
    leftButton = (
      <Button
        onClick={goToPreviousStep}
        variant="outline"
        size="sm"
        className="btn-secondary-light text-xs"
        disabled={currentDpoEntryIndex === 0 || isLoadingEntries || isSubmittingSurvey || !isCurrentEvaluationSubmitted}
      >
        <ArrowLeft size={16} className="mr-1.5" /> Back
      </Button>
    );
    centerText = (
      <p className="text-xs text-gray-500">
        Entry {Math.min(currentDpoEntryIndex + 1, dpoEntriesToReview.length)} of {dpoEntriesToReview.length}
      </p>
    );
    const isLastEntryInBatch = currentDpoEntryIndex >= dpoEntriesToReview.length - 1;
    rightButton = (
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
    // Thank You
    leftButton = (
      <Button variant="link" size="sm" asChild className="btn-link-light px-1 text-xs" disabled={isSubmittingSurvey}>
        <Link href="/">
          {' '}
          <Home size={14} className="mr-1" /> Return Home
        </Link>
      </Button>
    );
    if (!surveyCompleted) {
      // Only show Finish & Submit if not already completed
      rightButton = (
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
      rightButton = // Optionally show a disabled "Submitted" or nothing
        (
          <Button disabled={true} className="btn-primary-light min-w-[140px] cursor-not-allowed text-xs opacity-70">
            <CheckCheck size={16} className="mr-1.5" /> Submitted
          </Button>
        );
    }
  }

  return (
    <footer className="survey-nav-footer">
      <div className="flex w-1/3 justify-start">{leftButton}</div>
      <div className="flex w-1/3 items-center justify-center text-center">{centerText}</div>
      <div className="flex w-1/3 justify-end">{rightButton}</div>
    </footer>
  );
};
export default SurveyNavigationFooter;
