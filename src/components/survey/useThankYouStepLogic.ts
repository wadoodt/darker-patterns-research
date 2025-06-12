import React, { useEffect, useState } from 'react';
import { useSurveyProgress } from '../../contexts/SurveyProgressContext';

export interface ThankYouStepLogic {
  // State
  localEmailForUpdates: string;
  submittedEmailOnThisPage: boolean;
  localEmailError: string | null;
  effectiveEmail: string | null;
  canShowEmailForm: boolean;

  // Context values
  participationType: string | null;
  emailFromContext: string | null;
  surveyCompleted: boolean;
  isSubmittingSurvey: boolean;
  contextError: string | null;
  currentStepNumber: number;
  totalSteps: number;

  // Handlers
  handleEmailForUpdatesSubmit: (e: React.FormEvent) => void;
  handleLocalEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function useThankYouStepLogic(): ThankYouStepLogic {
  const {
    participationType,
    participantEmail: emailFromContext,
    setParticipantEmail,
    surveyCompleted,
    isSubmittingSurvey,
    error: contextError,
    setGlobalError,
    currentStepNumber,
    totalSteps,
    setHasUnsavedChanges,
  } = useSurveyProgress();

  const [localEmailForUpdates, setLocalEmailForUpdates] = useState('');
  const [submittedEmailOnThisPage, setSubmittedEmailOnThisPage] = useState(false);
  const [localEmailError, setLocalEmailError] = useState<string | null>(null);

  const canShowEmailForm = participationType === 'anonymous' && !emailFromContext && !submittedEmailOnThisPage;

  useEffect(() => {
    // Clear any previous errors when the component mounts or relevant state changes
    setGlobalError(null);
    setLocalEmailError(null);
    // No unsaved changes initially on this page until user interacts with the email form
    setHasUnsavedChanges(false);
  }, [setGlobalError, setHasUnsavedChanges]);

  const handleEmailForUpdatesSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLocalEmailError(null);
    if (!localEmailForUpdates || !/\S+@\S+\.\S+/.test(localEmailForUpdates)) {
      setLocalEmailError('Please enter a valid email address.');
      setHasUnsavedChanges(true); // User attempted interaction
      return;
    }
    setParticipantEmail(localEmailForUpdates); // Update context
    setSubmittedEmailOnThisPage(true);
    setHasUnsavedChanges(false); // Email "saved" to context
  };

  const handleLocalEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalEmailForUpdates(e.target.value);
    setLocalEmailError(null); // Clear error on change
    setHasUnsavedChanges(true); // Mark as having unsaved changes
  };

  const effectiveEmail = emailFromContext || (submittedEmailOnThisPage ? localEmailForUpdates : null);

  return {
    // State
    localEmailForUpdates,
    submittedEmailOnThisPage,
    localEmailError,
    effectiveEmail,
    canShowEmailForm,

    // Context values
    participationType,
    emailFromContext,
    surveyCompleted,
    isSubmittingSurvey,
    contextError,
    currentStepNumber,
    totalSteps,

    // Handlers
    handleEmailForUpdatesSubmit,
    handleLocalEmailChange,
  };
}
