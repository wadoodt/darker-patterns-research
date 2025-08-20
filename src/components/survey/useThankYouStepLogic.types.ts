import type { ChangeEvent, FormEvent } from 'react';

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
  handleEmailForUpdatesSubmit: (e: FormEvent) => void;
  handleLocalEmailChange: (e: ChangeEvent<HTMLInputElement>) => void;
}
