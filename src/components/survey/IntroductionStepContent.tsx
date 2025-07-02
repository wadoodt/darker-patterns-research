// components/survey/IntroductionStepContent.tsx
'use client';
import { canProceedFromIntroStep, validateEmail, validateParticipationDetails } from '@/lib/survey/validators';
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

  // Card-specific error states
  const [emailCardError, setEmailCardError] = useState<string | null>(null);
  const [anonymousCardError, setAnonymousCardError] = useState<string | null>(null);

  // Validation function to check if we can proceed - enhanced for better method switching
  const validateCurrentState = useCallback(() => {
    // Always clear errors first to start fresh
    setGlobalError(null);
    setEmailCardError(null);
    setAnonymousCardError(null);

    if (!selectedOption) {
      setGlobalError('Please select a participation method.');
      return false;
    }

    const currentTermsAgreed = selectedOption === 'email' ? agreedToTermsEmail : agreedToTermsAnonymous;

    // For email participation, check email validity first
    if (selectedOption === 'email') {
      if (!localEmail.trim()) {
        setEmailCardError('Please enter your email address to continue.');
        return false;
      }

      const emailError = validateEmail(localEmail);
      if (emailError) {
        setEmailCardError(emailError);
        return false;
      }

      if (!currentTermsAgreed) {
        setEmailCardError('Must agree to the terms and privacy policy to proceed.');
        return false;
      }
    }

    // For anonymous participation, only check terms agreement
    if (selectedOption === 'anonymous') {
      if (!currentTermsAgreed) {
        setAnonymousCardError('Must agree to the terms and privacy policy to proceed.');
        return false;
      }
    }

    // Use the improved validation function as final check
    const canProceed = canProceedFromIntroStep({
      type: selectedOption,
      email: selectedOption === 'email' ? localEmail : undefined,
      termsAgreed: currentTermsAgreed,
    });

    if (!canProceed) {
      // Fallback to detailed error message
      const validationError = validateParticipationDetails({
        type: selectedOption,
        email: selectedOption === 'email' ? localEmail : undefined,
        termsAgreed: currentTermsAgreed,
      });
      setGlobalError(validationError || 'Please complete all required fields.');
      return false;
    }

    return true;
  }, [
    selectedOption,
    localEmail,
    agreedToTermsEmail,
    agreedToTermsAnonymous,
    setGlobalError,
    setEmailCardError,
    setAnonymousCardError,
  ]);

  return useIntroductionStepLogic({
    selectedOption,
    setSelectedOption,
    localEmail,
    setLocalEmail,
    agreedToTermsEmail,
    setAgreedToTermsEmail,
    agreedToTermsAnonymous,
    setAgreedToTermsAnonymous,
    currentStepNumber,
    totalSteps,
    contextError,
    setGlobalError,
    setHasUnsavedChanges,
    setParticipationDetails,
    validateCurrentState,
    emailCardError,
    setEmailCardError,
    anonymousCardError,
    setAnonymousCardError,
  });
};

// Extract the main logic to a separate hook to reduce line count
function useIntroductionStepLogic({
  selectedOption,
  setSelectedOption,
  localEmail,
  setLocalEmail,
  agreedToTermsEmail,
  setAgreedToTermsEmail,
  agreedToTermsAnonymous,
  setAgreedToTermsAnonymous,
  currentStepNumber,
  totalSteps,
  contextError,
  setGlobalError,
  setHasUnsavedChanges,
  setParticipationDetails,
  validateCurrentState,
  emailCardError,
  setEmailCardError,
  anonymousCardError,
  setAnonymousCardError,
}: {
  selectedOption: 'email' | 'anonymous' | null;
  setSelectedOption: (option: 'email' | 'anonymous') => void;
  localEmail: string;
  setLocalEmail: (email: string) => void;
  agreedToTermsEmail: boolean;
  setAgreedToTermsEmail: (agreed: boolean) => void;
  agreedToTermsAnonymous: boolean;
  setAgreedToTermsAnonymous: (agreed: boolean) => void;
  currentStepNumber: number;
  totalSteps: number;
  contextError: string | null;
  setGlobalError: (error: string | null) => void;
  setHasUnsavedChanges: (hasChanges: boolean) => void;
  setParticipationDetails: (details: { type: 'email' | 'anonymous'; email?: string; termsAgreed: boolean }) => void;
  validateCurrentState: () => boolean;
  emailCardError: string | null;
  setEmailCardError: (error: string | null) => void;
  anonymousCardError: string | null;
  setAnonymousCardError: (error: string | null) => void;
}) {
  // Effect to mark unsaved changes and validate
  useEffect(() => {
    // Only set unsaved changes if there's an interaction
    if (selectedOption || localEmail || agreedToTermsEmail || agreedToTermsAnonymous) {
      setHasUnsavedChanges(true);
    }

    // Always validate current state whenever dependencies change
    // This ensures validation is re-triggered when switching methods
    validateCurrentState();

    // Force re-validation by updating participation details in context
    // This ensures the navigation footer gets the correct validation state
    if (selectedOption) {
      const currentTermsAgreed = selectedOption === 'email' ? agreedToTermsEmail : agreedToTermsAnonymous;
      setParticipationDetails({
        type: selectedOption,
        email: selectedOption === 'email' ? localEmail : undefined,
        termsAgreed: currentTermsAgreed,
      });
    }
  }, [
    selectedOption,
    localEmail,
    agreedToTermsEmail,
    agreedToTermsAnonymous,
    setHasUnsavedChanges,
    validateCurrentState,
    setParticipationDetails,
  ]);

  const handlers = useIntroductionHandlers({
    selectedOption,
    setSelectedOption,
    localEmail,
    setLocalEmail,
    setAgreedToTermsEmail,
    setAgreedToTermsAnonymous,
    setGlobalError,
    setParticipationDetails,
    setEmailCardError,
    setAnonymousCardError,
  });

  return (
    <IntroductionStepView
      currentStepNumber={currentStepNumber}
      totalSteps={totalSteps}
      selectedOption={selectedOption}
      localEmail={localEmail}
      agreedToTermsEmail={agreedToTermsEmail}
      agreedToTermsAnonymous={agreedToTermsAnonymous}
      contextError={contextError}
      emailCardError={emailCardError}
      anonymousCardError={anonymousCardError}
      onOptionSelect={handlers.handleOptionSelect}
      onTermsChange={handlers.handleTermsChange}
      onEmailChange={handlers.handleEmailChange}
    />
  );
}

// Extract handlers to separate hook
function useIntroductionHandlers({
  selectedOption,
  setSelectedOption,
  localEmail,
  setLocalEmail,
  setAgreedToTermsEmail,
  setAgreedToTermsAnonymous,
  setGlobalError,
  setParticipationDetails,
  setEmailCardError,
  setAnonymousCardError,
}: {
  selectedOption: 'email' | 'anonymous' | null;
  setSelectedOption: (option: 'email' | 'anonymous') => void;
  localEmail: string;
  setLocalEmail: (email: string) => void;
  setAgreedToTermsEmail: (agreed: boolean) => void;
  setAgreedToTermsAnonymous: (agreed: boolean) => void;
  setGlobalError: (error: string | null) => void;
  setParticipationDetails: (details: { type: 'email' | 'anonymous'; email?: string; termsAgreed: boolean }) => void;
  setEmailCardError: (error: string | null) => void;
  setAnonymousCardError: (error: string | null) => void;
}) {
  const handleOptionSelect = useHandleOptionSelect({
    selectedOption,
    setSelectedOption,
    setAgreedToTermsAnonymous,
    setAgreedToTermsEmail,
    setLocalEmail,
    setGlobalError,
    setParticipationDetails,
    setEmailCardError,
    setAnonymousCardError,
  });

  const handleEmailChange = useHandleEmailChange({
    selectedOption,
    setLocalEmail,
    setGlobalError,
  });

  const handleTermsChange = useHandleTermsChange({
    selectedOption,
    localEmail,
    setAgreedToTermsEmail,
    setAgreedToTermsAnonymous,
    setParticipationDetails,
    setGlobalError,
  });

  return {
    handleOptionSelect,
    handleEmailChange,
    handleTermsChange,
  };
}

// Custom hooks to handle specific interactions
function useHandleOptionSelect({
  selectedOption,
  setSelectedOption,
  setAgreedToTermsAnonymous,
  setAgreedToTermsEmail,
  setLocalEmail,
  setGlobalError,
  setParticipationDetails,
  setEmailCardError,
  setAnonymousCardError,
}: {
  selectedOption: 'email' | 'anonymous' | null;
  setSelectedOption: (option: 'email' | 'anonymous') => void;
  setAgreedToTermsAnonymous: (agreed: boolean) => void;
  setAgreedToTermsEmail: (agreed: boolean) => void;
  setLocalEmail: (email: string) => void;
  setGlobalError: (error: string | null) => void;
  setParticipationDetails: (details: { type: 'email' | 'anonymous'; email?: string; termsAgreed: boolean }) => void;
  setEmailCardError: (error: string | null) => void;
  setAnonymousCardError: (error: string | null) => void;
}) {
  return useCallback(
    (option: 'email' | 'anonymous') => {
      // If clicking on the same option that's already selected, do nothing
      // This prevents clearing errors when user clicks inside an already selected card
      if (selectedOption === option) {
        return;
      }

      setSelectedOption(option);

      // Reset terms agreement when switching methods
      if (option === 'email') {
        setAgreedToTermsAnonymous(false);
      } else {
        setAgreedToTermsEmail(false);
        // Clear email when switching to anonymous
        setLocalEmail('');
      }

      // Clear any existing errors when switching methods
      setGlobalError(null);
      setEmailCardError(null);
      setAnonymousCardError(null);

      // Reset participation details in context to ensure validation state is cleared
      // This prevents the button from staying enabled when switching methods
      setParticipationDetails({
        type: option,
        email: option === 'email' ? '' : undefined,
        termsAgreed: false,
      });
    },
    [
      selectedOption,
      setSelectedOption,
      setAgreedToTermsAnonymous,
      setAgreedToTermsEmail,
      setLocalEmail,
      setGlobalError,
      setParticipationDetails,
      setEmailCardError,
      setAnonymousCardError,
    ],
  );
}

function useHandleEmailChange({
  selectedOption,
  setLocalEmail,
  setGlobalError,
}: {
  selectedOption: 'email' | 'anonymous' | null;
  setLocalEmail: (email: string) => void;
  setGlobalError: (error: string | null) => void;
}) {
  return useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!selectedOption) return;
      const newEmail = e.target.value;
      setLocalEmail(newEmail);

      // Clear errors immediately when user starts typing
      setGlobalError(null);

      // Only validate if the user has typed something and selected email method
      if (selectedOption === 'email') {
        if (newEmail.trim()) {
          // Validate email format in real-time
          const emailError = validateEmail(newEmail);
          if (emailError) {
            setGlobalError(emailError);
          }
        } else {
          // Show error if email is empty for email participation
          setGlobalError('Email is required for email participation');
        }
      }
    },
    [selectedOption, setLocalEmail, setGlobalError],
  );
}

function useHandleTermsChange({
  selectedOption,
  localEmail,
  setAgreedToTermsEmail,
  setAgreedToTermsAnonymous,
  setParticipationDetails,
  setGlobalError,
}: {
  selectedOption: 'email' | 'anonymous' | null;
  localEmail: string;
  setAgreedToTermsEmail: (agreed: boolean) => void;
  setAgreedToTermsAnonymous: (agreed: boolean) => void;
  setParticipationDetails: (details: { type: 'email' | 'anonymous'; email?: string; termsAgreed: boolean }) => void;
  setGlobalError: (error: string | null) => void;
}) {
  return useCallback(
    (type: 'email' | 'anonymous', checked: boolean | 'indeterminate') => {
      if (!selectedOption) return;

      const isChecked = !!checked;

      if (type === 'email' && selectedOption === 'email') {
        // Validate email before allowing terms agreement
        if (isChecked) {
          const emailError = validateEmail(localEmail);
          if (emailError) {
            setGlobalError(emailError);
            return;
          }
          // Clear errors if email is valid and terms are being checked
          setGlobalError(null);
        }
        setAgreedToTermsEmail(isChecked);
        setParticipationDetails({
          type: selectedOption,
          email: localEmail,
          termsAgreed: isChecked,
        });
      } else if (type === 'anonymous' && selectedOption === 'anonymous') {
        // Clear errors when checking terms for anonymous participation
        if (isChecked) {
          setGlobalError(null);
        }
        setAgreedToTermsAnonymous(isChecked);
        setParticipationDetails({
          type: selectedOption,
          email: undefined,
          termsAgreed: isChecked,
        });
      }
    },
    [
      selectedOption,
      localEmail,
      setAgreedToTermsEmail,
      setAgreedToTermsAnonymous,
      setParticipationDetails,
      setGlobalError,
    ],
  );
}

export default IntroductionStepContent;
