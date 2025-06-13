import type { SurveyContextValue } from '@/types/survey';
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
  } = useSurveyProgress();

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
