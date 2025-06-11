// components/survey/IntroductionStepContent.tsx
'use client';
import type React from 'react'; // Import React for type React.FormEvent
import { useState, useEffect, useCallback } from 'react';
import { useSurveyProgress } from '../../contexts/SurveyProgressContext';
import { Button } from '@/components/ui/button'; // Assuming usage of ShadCN button
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { ShieldCheck, Mail, User, AlertTriangle, Award } from 'lucide-react';
import Link from 'next/link'; // For ToS/Privacy links

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedOption, localEmail, agreedToTermsEmail, agreedToTermsAnonymous, setParticipationDetails]); // setGlobalError removed

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
    <div className="survey-page-container max-w-2xl">
      <div className="survey-step-title-container">
        <p className="survey-step-indicator">
          Step {currentStepNumber} of {totalSteps}: Welcome!
        </p>
        <h2 className="survey-main-title">Join the Dark Pattern Validation Study</h2>
      </div>

      <p className="font-body-academic text-light-text-secondary mb-6 text-sm leading-relaxed sm:text-base">
        Thank you for your interest! This study aims to create a human-validated dataset for detecting "dark patterns"
        in Large Language Models (LLMs). Your participation is crucial.
      </p>

      {contextError && (
        <div className="mb-6 flex items-center gap-2 rounded-md border border-red-300 bg-red-100 p-3 text-xs text-red-700">
          <AlertTriangle size={16} /> {contextError}
        </div>
      )}

      <section className="space-y-6">
        <h3 className="survey-section-title !mb-4 text-center">Choose Your Participation Method:</h3>
        <div className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2">
          {/* Email Option Card */}
          <div
            onClick={() => handleOptionSelect('email')}
            className={`auth-option-card-survey ${selectedOption === 'email' ? 'selected' : ''} ${selectedOption !== 'anonymous' ? 'recommended' : ''}`}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && handleOptionSelect('email')}
          >
            {selectedOption !== 'anonymous' && (
              <span className="auth-option-badge">
                <Award size={12} className="mr-0.5 inline" />
                Recommended
              </span>
            )}
            <Mail size={24} className="text-brand-purple-500 mx-auto mb-2" />
            <h4 className="auth-option-title text-center">Participate with Email</h4>
            <div className="auth-option-description">
              <ul>
                <li>Receive research updates.</li>
                <li>Get a copy of the published paper.</li>
                <li>Contribute to a richer dataset.</li>
              </ul>
            </div>
            {selectedOption === 'email' && (
              <div className="mt-auto space-y-2 pt-3">
                <Input
                  type="email"
                  placeholder="your.email@example.com"
                  value={localEmail}
                  onChange={handleEmailChange}
                  className="form-input-light h-9 text-xs"
                  required
                />
                <div className="terms-checkbox-label">
                  <Checkbox
                    id="termsEmail"
                    checked={agreedToTermsEmail}
                    onCheckedChange={(checked) => handleTermsChange('email', checked)}
                    className="form-checkbox-custom-light"
                  />
                  <label htmlFor="termsEmail" className="ml-2 text-xs">
                    I agree to the{' '}
                    <Link href="/info/terms-conditions" className="link-standard-light" target="_blank">
                      Terms
                    </Link>{' '}
                    &amp;{' '}
                    <Link href="/info/ethics-privacy-participation" className="link-standard-light" target="_blank">
                      Privacy Policy
                    </Link>
                    .
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* Anonymous Option Card */}
          <div
            onClick={() => handleOptionSelect('anonymous')}
            className={`auth-option-card-survey ${selectedOption === 'anonymous' ? 'selected' : ''}`}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && handleOptionSelect('anonymous')}
          >
            <User size={24} className="text-brand-purple-500 mx-auto mb-2" />
            <h4 className="auth-option-title text-center">Participate Anonymously</h4>
            <div className="auth-option-description">
              <ul>
                <li>No email required.</li>
                <li>Your responses remain fully anonymous.</li>
                <li>Still a valuable contribution!</li>
              </ul>
            </div>
            {selectedOption === 'anonymous' && (
              <div className="terms-checkbox-label mt-auto pt-3">
                <Checkbox
                  id="termsAnonymous"
                  checked={agreedToTermsAnonymous}
                  onCheckedChange={(checked) => handleTermsChange('anonymous', checked)}
                  className="form-checkbox-custom-light"
                />
                <label htmlFor="termsAnonymous" className="ml-2 text-xs">
                  I agree to the{' '}
                  <Link href="/info/terms-conditions" className="link-standard-light" target="_blank">
                    Terms
                  </Link>{' '}
                  &amp;{' '}
                  <Link href="/info/ethics-privacy-participation" className="link-standard-light" target="_blank">
                    Privacy Policy
                  </Link>
                  .
                </label>
              </div>
            )}
          </div>
        </div>
      </section>

      <div className="survey-section-card mt-8 p-4">
        <div className="flex items-start gap-3">
          <ShieldCheck size={28} className="mt-0.5 flex-shrink-0 text-green-600" />
          <div>
            <h4 className="font-lora text-light-text-primary text-sm font-semibold">Your Privacy is Important</h4>
            <p className="text-light-text-secondary mt-0.5 text-xs">
              All data collected is for research purposes only and will be handled according to our{' '}
              <Link href="/info/ethics-privacy-participation" className="link-standard-light" target="_blank">
                Ethics & Privacy Policy
              </Link>
              . Email addresses, if provided, are stored separately and will not be linked to your specific evaluation
              responses in any public dataset.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntroductionStepContent;
