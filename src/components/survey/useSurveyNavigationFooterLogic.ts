import { useMemo } from 'react';
import { useSurveyProgress } from '../../contexts/SurveyProgressContext';

export function useSurveyNavigationFooterLogic() {
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

  const isLastEntryInBatch = useMemo(
    () => currentDpoEntryIndex >= dpoEntriesToReview.length - 1,
    [currentDpoEntryIndex, dpoEntriesToReview.length],
  );

  return {
    currentStepNumber,
    goToNextStep,
    goToPreviousStep,
    saveDemographics,
    completeSurveyAndPersistData,
    isLoadingEntries,
    isSubmittingSurvey,
    isCurrentEvaluationSubmitted,
    contextError,
    surveyCompleted,
    canProceedFromIntro,
    canProceedFromDemographics,
    dpoEntriesToReview,
    currentDpoEntryIndex,
    isLastEntryInBatch,
    participantEmail,
    participationType,
    termsAgreed,
  };
}
