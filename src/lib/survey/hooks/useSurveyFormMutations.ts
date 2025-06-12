import type { DemographicData, DPOEntry, EvaluationDraft } from '@/types/dpo';
import type { SurveyState } from '@/types/survey';
import type { Dispatch } from 'react';
import { useCallback } from 'react';
import { SurveyAction, SurveyActionType } from '../actions';
import { persistSurveyData } from '../database';
import { buildParticipantData, calculateTotalTimeSpent, createNewEvaluation } from '../evaluationUtils';
import { handleDispatchError, validateSessionExists } from '../surveyUtils';
import { validateDemographics, validateEmail, validateParticipationDetails } from '../validators';

export interface UseSurveyFormMutations {
  setParticipationDetails: (details: { type: 'email' | 'anonymous'; email?: string; termsAgreed: boolean }) => void;
  setParticipantEmail: (email: string) => void;
  updateDemographicsInContext: (data: DemographicData) => void;
  submitEvaluation: (evaluationDraft: EvaluationDraft, currentEntry: DPOEntry) => void;
  completeSurveyAndPersistData: () => Promise<void>;
}

export function useSurveyFormMutations(state: SurveyState, dispatch: Dispatch<SurveyAction>): UseSurveyFormMutations {
  const setParticipationDetails = useCallback(
    (details: { type: 'email' | 'anonymous'; email?: string; termsAgreed: boolean }) => {
      const error = validateParticipationDetails(details);
      if (error) {
        dispatch({ type: SurveyActionType.SET_ERROR, payload: error });
        return;
      }
      dispatch({ type: SurveyActionType.SET_PARTICIPATION_DETAILS, payload: details });
    },
    [dispatch],
  );

  const setParticipantEmail = useCallback(
    (email: string) => {
      if (!validateEmail(email)) {
        dispatch({ type: SurveyActionType.SET_ERROR, payload: 'Please provide a valid email address.' });
        return;
      }
      dispatch({ type: SurveyActionType.SET_PARTICIPANT_EMAIL, payload: email });
    },
    [dispatch],
  );

  const updateDemographicsInContext = useCallback(
    (data: DemographicData) => {
      const error = validateDemographics(data);
      if (error) {
        dispatch({ type: SurveyActionType.SET_ERROR, payload: error });
        return;
      }
      dispatch({ type: SurveyActionType.UPDATE_DEMOGRAPHICS, payload: data });
    },
    [dispatch],
  );

  const submitEvaluation = useCallback(
    (evaluationDraft: EvaluationDraft, currentEntry: DPOEntry) => {
      if (!currentEntry || !state.participantSessionUid) {
        dispatch({
          type: SurveyActionType.SET_ERROR,
          payload: 'Error submitting evaluation. No current entry or session UID.',
        });
        return;
      }

      const newEvaluation = createNewEvaluation(evaluationDraft, state.participantSessionUid, currentEntry);
      dispatch({ type: SurveyActionType.SET_EVALUATION, payload: newEvaluation });
    },
    [state.participantSessionUid, dispatch],
  );

  const completeSurveyAndPersistData = useCallback(async () => {
    if (!validateSessionExists(state.participantSessionUid, dispatch)) {
      return;
    }

    dispatch({ type: SurveyActionType.SET_SUBMITTING, payload: true });

    try {
      const totalTimeSpentMs = calculateTotalTimeSpent(state.evaluations);
      const participantData = buildParticipantData(
        state.participationType!,
        state.participantEmail,
        state.termsAgreed,
        state.demographicsData,
        state.dpoEntriesToReview,
        state.evaluations,
        totalTimeSpentMs,
      );

      await persistSurveyData(state.participantSessionUid!, participantData, state.evaluations);
      dispatch({ type: SurveyActionType.COMPLETE_SURVEY });
    } catch (error: unknown) {
      handleDispatchError(dispatch, error);
    } finally {
      dispatch({ type: SurveyActionType.SET_SUBMITTING, payload: false });
    }
  }, [state, dispatch]);

  return {
    setParticipationDetails,
    setParticipantEmail,
    updateDemographicsInContext,
    submitEvaluation,
    completeSurveyAndPersistData,
  };
}
