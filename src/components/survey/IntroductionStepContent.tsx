// components/survey/IntroductionStepContent.tsx
'use client';
import type React from 'react';
import { useCallback, useEffect, useState } from 'react';
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

  // Effect to sync local state to context
  const syncToContext = useCallback(() => {
    if (selectedOption) {
      const termsMet = selectedOption === 'email' ? agreedToTermsEmail : agreedToTermsAnonymous;
      setParticipationDetails({
        type: selectedOption,
        email: selectedOption === 'email' ? localEmail : undefined,
        termsAgreed: termsMet,
      });
      // Basic email validation for context, footer will do stricter check
      if (selectedOption === 'email' && localEmail && !/\S+@\S+\.\S+/.test(localEmail)) {
        setGlobalError('Please enter a valid email address.');
      } else if (termsMet && selectedOption === 'email' && !localEmail) {
        setGlobalError('Email is required for this participation type.');
      } else {
        setGlobalError(null);
      }
    }
  }, [selectedOption, localEmail, agreedToTermsEmail, agreedToTermsAnonymous, setParticipationDetails, setGlobalError]);

  useEffect(() => {
    syncToContext();
  }, [syncToContext]);

  // Effect to mark unsaved changes
  useEffect(() => {
    // Only set unsaved changes if there's an interaction
    if (selectedOption || localEmail || agreedToTermsEmail || agreedToTermsAnonymous) {
      setHasUnsavedChanges(true);
    }
  }, [selectedOption, localEmail, agreedToTermsEmail, agreedToTermsAnonymous, setHasUnsavedChanges]);

  const handleOptionSelect = (option: 'email' | 'anonymous') => {
    setSelectedOption(option);
    setGlobalError(null);
    if (option === 'anonymous') setLocalEmail(''); // Clear email if anonymous is chosen
  };

  const handleTermsChange = (type: 'email' | 'anonymous', checked: boolean | 'indeterminate') => {
    if (type === 'email') setAgreedToTermsEmail(!!checked);
    else setAgreedToTermsAnonymous(!!checked);
    setGlobalError(null);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalEmail(e.target.value);
    setGlobalError(null);
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
