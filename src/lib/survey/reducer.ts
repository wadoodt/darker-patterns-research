/* eslint-disable max-lines-per-function */
import type { SurveyState } from '@/types/survey';
import { SurveyAction, SurveyActionType } from './actions';
import { validateDemographics, validateEmail } from './validators';

export const initialState: SurveyState = {
  currentStepNumber: 1,
  totalSteps: 4,
  participantSessionUid: null,
  participationType: null,
  participantEmail: null,
  termsAgreed: false,
  demographicsData: null,
  dpoEntriesToReview: [],
  currentDpoEntryIndex: 0,
  isLoadingEntries: false,
  evaluations: [],
  surveyCompleted: false,
  error: null,
  isSubmittingSurvey: false,
  isCurrentEvaluationSubmitted: false,
  hasUnsavedChanges: false,
  currentDisplayEntry: null, // Inicializar como null
};

export function surveyReducer(state: SurveyState, action: SurveyAction): SurveyState {
  switch (action.type) {
    case SurveyActionType.START_SESSION:
      return {
        ...initialState,
        participantSessionUid: crypto.randomUUID(),
        currentStepNumber: 1,
        hasUnsavedChanges: false,
      };

    case SurveyActionType.SET_PARTICIPATION_DETAILS: {
      return {
        ...state,
        participationType: action.payload.type,
        participantEmail: action.payload.type === 'email' ? action.payload.email || null : null,
        termsAgreed: action.payload.termsAgreed,
        hasUnsavedChanges: true,
        error: null,
      };
    }

    case SurveyActionType.SET_PARTICIPANT_EMAIL: {
      const validationError = validateEmail(action.payload);
      if (validationError) {
        return { ...state, error: validationError, hasUnsavedChanges: true };
      }
      return { ...state, participantEmail: action.payload, hasUnsavedChanges: false };
    }

    case SurveyActionType.UPDATE_DEMOGRAPHICS: {
      const validationError = validateDemographics(action.payload);
      if (validationError) {
        return { ...state, error: validationError, hasUnsavedChanges: true };
      }
      return { ...state, demographicsData: action.payload, hasUnsavedChanges: true };
    }

    case SurveyActionType.SET_LOADING_ENTRIES:
      return { ...state, isLoadingEntries: action.payload };

    case SurveyActionType.SET_ENTRIES:
      return {
        ...state,
        dpoEntriesToReview: action.payload,
        currentDpoEntryIndex: 0,
        isLoadingEntries: false,
        currentStepNumber: 3,
        isCurrentEvaluationSubmitted: false,
        currentDisplayEntry: action.payload[0] || null, // Establecer la primera entrada
      };

    case SurveyActionType.SET_EVALUATION:
      return {
        ...state,
        evaluations: [...state.evaluations, action.payload],
        error: null,
      };

    case SurveyActionType.MARK_EVALUATION_SUBMITTED:
      return { ...state, isCurrentEvaluationSubmitted: true, hasUnsavedChanges: false };

    case SurveyActionType.RESET_EVALUATION_SUBMITTED:
      return { ...state, isCurrentEvaluationSubmitted: false, hasUnsavedChanges: true };

    case SurveyActionType.GO_TO_NEXT_STEP: {
      if (state.currentStepNumber === 3 && !state.isCurrentEvaluationSubmitted) {
        return { ...state, error: 'Please submit your evaluation for the current entry first.' };
      }

      if (state.currentStepNumber === 3) {
        const nextIndex = state.currentDpoEntryIndex + 1;
        if (nextIndex >= state.dpoEntriesToReview.length) {
          return {
            ...state,
            currentStepNumber: 4,
            isCurrentEvaluationSubmitted: false,
            hasUnsavedChanges: false,
            currentDisplayEntry: null,
          };
        }
        const nextEntry = state.dpoEntriesToReview[nextIndex];
        const hasEvaluation = state.evaluations.some((evaluation) => evaluation.dpoEntryId === nextEntry.id);
        return {
          ...state,
          currentDpoEntryIndex: nextIndex,
          isCurrentEvaluationSubmitted: hasEvaluation,
          hasUnsavedChanges: false,
          currentDisplayEntry: nextEntry,
        };
      }

      return {
        ...state,
        currentStepNumber: state.currentStepNumber + 1,
        error: null,
        hasUnsavedChanges: false,
      };
    }

    case SurveyActionType.GO_TO_PREVIOUS_STEP: {
      if (state.currentStepNumber === 3) {
        if (state.currentDpoEntryIndex > 0) {
          const prevIndex = state.currentDpoEntryIndex - 1;
          const prevEntry = state.dpoEntriesToReview[prevIndex];
          const hasEvaluation = state.evaluations.some((evaluation) => evaluation.dpoEntryId === prevEntry.id);
          return {
            ...state,
            currentDpoEntryIndex: prevIndex,
            isCurrentEvaluationSubmitted: hasEvaluation,
            hasUnsavedChanges: false,
            currentDisplayEntry: prevEntry,
          };
        }
        return {
          ...state,
          currentStepNumber: 2,
          isCurrentEvaluationSubmitted: false,
          dpoEntriesToReview: [],
          isLoadingEntries: false,
          hasUnsavedChanges: false,
          currentDisplayEntry: null,
        };
      }

      if (state.currentStepNumber > 1) {
        return {
          ...state,
          currentStepNumber: state.currentStepNumber - 1,
          hasUnsavedChanges: false,
        };
      }

      return state;
    }

    case SurveyActionType.SET_ERROR:
      return { ...state, error: action.payload };

    case SurveyActionType.SET_SUBMITTING:
      return { ...state, isSubmittingSurvey: action.payload };

    case SurveyActionType.COMPLETE_SURVEY:
      return {
        ...state,
        surveyCompleted: true,
        isSubmittingSurvey: false,
        error: null,
        hasUnsavedChanges: false,
        currentStepNumber: 4,
        currentDisplayEntry: null,
      };

    case SurveyActionType.RESET_SURVEY:
      return { ...initialState };

    case SurveyActionType.SET_UNSAVED_CHANGES:
      return { ...state, hasUnsavedChanges: action.payload };

    default:
      return state;
  }
}
