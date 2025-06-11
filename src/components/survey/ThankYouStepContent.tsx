// src/components/survey/ThankYouStepContent.tsx
'use client';
import type React from 'react'; // Ensure React is imported
import { useState, useEffect } from 'react';
import { useSurveyProgress } from '../../contexts/SurveyProgressContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CheckCircle, Mail, Gift, PartyPopper, AlertTriangle, Home } from 'lucide-react'; // Added Home
import Link from 'next/link'; // For the "Return Home" link in this component if footer is not used for that.

const ThankYouStepContent = () => {
  const {
    participationType,
    participantEmail: emailFromContext,
    setParticipantEmail, // To update context if email is provided here
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

  return (
    <div className="survey-page-container max-w-lg text-center">
      <div className="survey-step-title-container mb-6 sm:mb-8">
        <p className="survey-step-indicator">
          Step {currentStepNumber} of {totalSteps}: Completion
        </p>
        <h2 className="survey-main-title flex items-center justify-center gap-2 !text-3xl">
          <PartyPopper size={30} className="text-brand-purple-500" /> Thank You!
        </h2>
      </div>

      <div className="survey-section-card animate-thank-you-pop space-y-5 p-6 sm:p-8">
        <CheckCircle size={48} className="mx-auto mb-3 text-green-500" />
        <p className="font-body-academic text-light-text-primary text-base leading-relaxed sm:text-lg">
          Your contribution is invaluable to our research on dark patterns in Large Language Models.
        </p>
        <p className="text-light-text-secondary text-sm">
          The data you've provided will help us build a robust dataset for creating more ethical and transparent AI
          systems.
        </p>

        {contextError && (
          <div className="my-4 flex items-center justify-center gap-2 rounded-md border border-red-300 bg-red-100 p-3 text-xs text-red-600">
            <AlertTriangle size={16} /> {contextError}
          </div>
        )}

        {effectiveEmail ? (
          <div className="border-light-border-primary mt-5 border-t pt-4">
            <Mail size={20} className="text-brand-purple-500 mx-auto mb-2" />
            <p className="text-light-text-secondary text-sm">
              We have your email: <strong className="text-light-text-primary">{effectiveEmail}</strong>.
              <br />
              You'll receive updates about the research and a copy of the paper once published.
            </p>
          </div>
        ) : canShowEmailForm ? (
          <form
            onSubmit={handleEmailForUpdatesSubmit}
            className="border-light-border-primary mt-5 space-y-3 border-t pt-4"
          >
            <Gift size={20} className="text-brand-purple-500 mx-auto mb-1" />
            <p className="text-light-text-secondary text-sm font-medium">
              Would you like to receive research updates and a copy of the paper?
            </p>
            <div className="mx-auto flex max-w-sm flex-col items-center justify-center gap-2 sm:flex-row">
              <Input
                type="email"
                name="localEmailForUpdates"
                id="localEmailForUpdates"
                placeholder="Enter your email address"
                value={localEmailForUpdates}
                onChange={handleLocalEmailChange}
                className="form-input-light h-10 flex-grow text-xs"
                disabled={isSubmittingSurvey}
              />
              <Button
                type="submit"
                className="btn-primary-light w-full px-3 py-2 text-xs sm:w-auto"
                disabled={isSubmittingSurvey || !localEmailForUpdates}
              >
                Submit Email
              </Button>
            </div>
            {localEmailError && <p className="mt-1 text-xs text-red-600">{localEmailError}</p>}
            <p className="text-light-text-tertiary text-xs">You can skip this if you prefer.</p>
          </form>
        ) : (
          // Case: Anonymous and already decided not to submit email here, or submitted one
          <div className="border-light-border-primary mt-5 border-t pt-4">
            <p className="text-light-text-secondary text-sm">
              You chose to participate anonymously. Thank you for your contribution!
            </p>
          </div>
        )}

        {surveyCompleted && !isSubmittingSurvey && (
          <div className="mt-6 text-center">
            <p className="mb-3 text-sm font-semibold text-green-600">Survey submitted successfully!</p>
            <Link href="/" className="btn-secondary-light text-xs">
              <Home size={14} className="mr-1.5" /> Return to Homepage
            </Link>
          </div>
        )}
      </div>

      {!surveyCompleted && (
        <p className="mt-6 text-center text-xs text-gray-500">
          Please click "Finish & Submit" below to record your responses.
        </p>
      )}
    </div>
  );
};

export default ThankYouStepContent;
