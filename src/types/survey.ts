import type { DemographicData, DPOEntry, EvaluationData, EvaluationDraft } from './dpo';

export interface SurveyState {
  currentStepNumber: number;
  totalSteps: number;
  participantSessionUid: string | null;
  participationType: 'email' | 'anonymous' | null;
  participantEmail: string | null;
  termsAgreed: boolean;
  demographicsData: DemographicData | null;
  dpoEntriesToReview: DPOEntry[];
  currentDpoEntryIndex: number;
  isLoadingEntries: boolean;
  evaluations: EvaluationData[];
  surveyCompleted: boolean;
  error: string | null;
  isSubmittingSurvey: boolean;
  isCurrentEvaluationSubmitted: boolean;
  hasUnsavedChanges: boolean;
}

export interface SurveyAction {
  type: string;
  payload?: unknown;
}

export interface SurveyContextValue extends SurveyState {
  setParticipationDetails: (details: { type: 'email' | 'anonymous'; email?: string; termsAgreed: boolean }) => void;
  setParticipantEmail: (email: string) => void;
  updateDemographicsInContext: (data: DemographicData) => void;
  saveDemographics: () => Promise<void>;
  getCurrentDpoEntry: () => DPOEntry | null;
  submitEvaluation: (evaluationDraft: EvaluationDraft) => void;
  markCurrentEvaluationSubmitted: () => void;
  resetCurrentEvaluationSubmitted: () => void;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
  completeSurveyAndPersistData: () => Promise<void>;
  setGlobalError: (message: string | null) => void;
  resetSurvey: () => void;
  setHasUnsavedChanges: (hasChanges: boolean) => void;
}
