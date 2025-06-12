import type { SurveyState } from '@/types/survey';
import type { Dispatch } from 'react';
import { useCallback } from 'react';
import { SurveyAction, SurveyActionType } from '../actions';

export interface UseSurveyNavigationMutations {
  setGlobalError: (message: string | null) => void;
  resetSurvey: () => void;
  markCurrentEvaluationSubmitted: () => void;
  resetCurrentEvaluationSubmitted: () => void;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
  setHasUnsavedChanges: (hasChanges: boolean) => void;
}

export function useSurveyNavigationMutations(
  state: SurveyState,
  dispatch: Dispatch<SurveyAction>,
): UseSurveyNavigationMutations {
  const setGlobalError = useCallback(
    (message: string | null) => {
      dispatch({ type: SurveyActionType.SET_ERROR, payload: message });
    },
    [dispatch],
  );

  const resetSurvey = useCallback(() => {
    dispatch({ type: SurveyActionType.START_SESSION });
  }, [dispatch]);

  const markCurrentEvaluationSubmitted = useCallback(() => {
    dispatch({ type: SurveyActionType.MARK_EVALUATION_SUBMITTED });
  }, [dispatch]);

  const resetCurrentEvaluationSubmitted = useCallback(() => {
    dispatch({ type: SurveyActionType.RESET_EVALUATION_SUBMITTED });
  }, [dispatch]);

  const goToNextStep = useCallback(() => {
    dispatch({ type: SurveyActionType.GO_TO_NEXT_STEP });
  }, [dispatch]);

  const goToPreviousStep = useCallback(() => {
    dispatch({ type: SurveyActionType.GO_TO_PREVIOUS_STEP });
  }, [dispatch]);

  const setHasUnsavedChanges = useCallback(
    (hasChanges: boolean) => {
      dispatch({ type: SurveyActionType.SET_UNSAVED_CHANGES, payload: hasChanges });
    },
    [dispatch],
  );

  return {
    setGlobalError,
    resetSurvey,
    markCurrentEvaluationSubmitted,
    resetCurrentEvaluationSubmitted,
    goToNextStep,
    goToPreviousStep,
    setHasUnsavedChanges,
  };
}
