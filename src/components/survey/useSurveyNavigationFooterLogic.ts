import type { SurveyContextValue } from '@/types/survey';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useSurveyProgress } from '../../contexts/SurveyProgressContext';

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

const handleStepNavigation = (
  stepNumber: number,
  router: AppRouterInstance,
  setGlobalError: (error: string) => void,
) => {
  if (stepNumber > 1) {
    switch (stepNumber) {
      case 1:
        break;
      case 2:
        router.push('/step-demographics');
        break;
      case 3:
        router.push('/step-evaluation');
        break;
      case 4:
        router.push('/step-thank-you');
        break;
      default:
        setGlobalError('Invalid step number');
        break;
    }
  }
};

export function useSurveyNavigationFooterLogic(): NavigationProps {
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
    isSubmittingSurvey,
    isCurrentEvaluationSubmitted,
    error: contextError,
    surveyCompleted,
    setGlobalError,
  } = useSurveyProgress();
  const router = useRouter();

  useEffect(() => {
    handleStepNavigation(currentStepNumber || 1, router, setGlobalError);
  }, [currentStepNumber, router]);

  // Validation for Introduction Step (Step 1)
  const canProceedFromIntro: boolean =
    !!participationType &&
    !!termsAgreed &&
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

  const isLastEntryInBatch = currentDpoEntryIndex >= dpoEntriesToReview.length - 1;

  const returnValue: NavigationProps = {
    currentStepNumber,
    goToNextStep,
    goToPreviousStep,
    saveDemographics,
    completeSurveyAndPersistData,
    isLoadingEntries,
    isSubmittingSurvey,
    isCurrentEvaluationSubmitted,
    error: contextError,
    surveyCompleted: !!surveyCompleted,
    dpoEntriesToReview,
    currentDpoEntryIndex,
    canProceedFromIntro,
    canProceedFromDemographics,
    isLastEntryInBatch,
  };

  return returnValue;
}
