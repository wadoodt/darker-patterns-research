// components/survey/IntroductionStepContent.tsx
'use client';
import { validateEmail } from '@/lib/survey/validators';
import type React from 'react';
import { useEffect, useState } from 'react';
import { useSurveyProgress } from '../../contexts/SurveyProgressContext';
import IntroductionStepView from './IntroductionStepView';

const IntroductionStepContent = () => {
  const {
    setParticipationDetails,
    currentStepNumber,
    totalSteps,
    participationType: contextParticipationType,
    participantEmail: contextEmail,
    termsAgreed: contextTermsAgreed,
    error: contextError,
    setGlobalError,
    setHasUnsavedChanges,
  } = useSurveyProgress();

  const [selectedOption, setSelectedOption] = useState<'email' | 'anonymous' | null>(contextParticipationType);
  const [localEmail, setLocalEmail] = useState(contextEmail || '');
  const [agreedToTermsEmail, setAgreedToTermsEmail] = useState(selectedOption === 'email' ? contextTermsAgreed : false);
  const [agreedToTermsAnonymous, setAgreedToTermsAnonymous] = useState(
    selectedOption === 'anonymous' ? contextTermsAgreed : false,
  );

  // Effect to mark unsaved changes
  useEffect(() => {
    // Only set unsaved changes if there's an interaction
    if (selectedOption || localEmail || agreedToTermsEmail || agreedToTermsAnonymous) {
      setHasUnsavedChanges(true);
    }
  }, [selectedOption, localEmail, agreedToTermsEmail, agreedToTermsAnonymous, setHasUnsavedChanges]);

  const handleOptionSelect = (option: 'email' | 'anonymous') => {
    setSelectedOption(option);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!selectedOption) return;
    setLocalEmail(e.target.value);
    if (e.target.value.length > 0) setGlobalError(null);
  };

  const handleTermsChange = (type: 'email' | 'anonymous', checked: boolean | 'indeterminate') => {
    if (!selectedOption) return;
    if (type === 'email') {
      const error = validateEmail(localEmail);
      if (error) {
        setGlobalError(error);
        return;
      }
      setAgreedToTermsEmail(!!checked);
      setParticipationDetails({
        type: selectedOption,
        email: selectedOption === 'email' ? localEmail : undefined,
        termsAgreed: !!checked,
      });
    } else {
      setAgreedToTermsAnonymous(!!checked);
      setParticipationDetails({
        type: selectedOption,
        email: selectedOption === 'email' ? localEmail : undefined,
        termsAgreed: !!checked,
      });
    }
  };

  return (
    <IntroductionStepView
      currentStepNumber={currentStepNumber}
      totalSteps={totalSteps}
      selectedOption={selectedOption}
      localEmail={localEmail}
      agreedToTermsEmail={agreedToTermsEmail}
      agreedToTermsAnonymous={agreedToTermsAnonymous}
      contextError={contextError}
      onOptionSelect={handleOptionSelect}
      onTermsChange={handleTermsChange}
      onEmailChange={handleEmailChange}
    />
  );
};

export default IntroductionStepContent;
