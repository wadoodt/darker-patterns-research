import type { DemographicData, DPOEntry, EvaluationData } from '@/types/dpo';

export enum SurveyActionType {
  START_SESSION = 'START_SESSION',
  SET_PARTICIPATION_DETAILS = 'SET_PARTICIPATION_DETAILS',
  SET_PARTICIPANT_EMAIL = 'SET_PARTICIPANT_EMAIL',
  UPDATE_DEMOGRAPHICS = 'UPDATE_DEMOGRAPHICS',
  SET_LOADING_ENTRIES = 'SET_LOADING_ENTRIES',
  SET_ENTRIES = 'SET_ENTRIES',
  SET_EVALUATION = 'SET_EVALUATION',
  MARK_EVALUATION_SUBMITTED = 'MARK_EVALUATION_SUBMITTED',
  RESET_EVALUATION_SUBMITTED = 'RESET_EVALUATION_SUBMITTED',
  GO_TO_NEXT_STEP = 'GO_TO_NEXT_STEP',
  GO_TO_PREVIOUS_STEP = 'GO_TO_PREVIOUS_STEP',
  SET_ERROR = 'SET_ERROR',
  SET_SUBMITTING = 'SET_SUBMITTING',
  COMPLETE_SURVEY = 'COMPLETE_SURVEY',
  RESET_SURVEY = 'RESET_SURVEY',
  SET_UNSAVED_CHANGES = 'SET_UNSAVED_CHANGES',
  UPDATE_DPO_ENTRY_USER_STATE = 'UPDATE_DPO_ENTRY_USER_STATE',
}

export type SurveyAction =
  | { type: SurveyActionType.START_SESSION }
  | {
      type: SurveyActionType.SET_PARTICIPATION_DETAILS;
      payload: { type: 'email' | 'anonymous'; email?: string; termsAgreed: boolean };
    }
  | { type: SurveyActionType.SET_PARTICIPANT_EMAIL; payload: string }
  | { type: SurveyActionType.UPDATE_DEMOGRAPHICS; payload: DemographicData }
  | { type: SurveyActionType.SET_LOADING_ENTRIES; payload: boolean }
  | { type: SurveyActionType.SET_ENTRIES; payload: DPOEntry[] }
  | { type: SurveyActionType.SET_EVALUATION; payload: EvaluationData }
  | { type: SurveyActionType.MARK_EVALUATION_SUBMITTED }
  | { type: SurveyActionType.RESET_EVALUATION_SUBMITTED }
  | { type: SurveyActionType.GO_TO_NEXT_STEP }
  | { type: SurveyActionType.GO_TO_PREVIOUS_STEP }
  | { type: SurveyActionType.SET_ERROR; payload: string | null }
  | { type: SurveyActionType.SET_SUBMITTING; payload: boolean }
  | { type: SurveyActionType.COMPLETE_SURVEY }
  | { type: SurveyActionType.RESET_SURVEY }
  | { type: SurveyActionType.SET_UNSAVED_CHANGES; payload: boolean }
  | {
      type: SurveyActionType.UPDATE_DPO_ENTRY_USER_STATE;
      payload: {
        entryId: string;
        updates: Partial<DPOEntry>;
      };
    };
