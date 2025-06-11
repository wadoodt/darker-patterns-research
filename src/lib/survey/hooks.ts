import type { DemographicData, DPOEntry, EvaluationData, EvaluationDraft, ParticipantSession } from '@/types/dpo';
import type { SurveyState } from '@/types/survey';
import type { Dispatch } from 'react';
import { useCallback } from 'react';
import { SurveyAction, SurveyActionType } from './actions';
import { generateDummyEntries, persistSurveyData } from './database';
import { validateDemographics, validateEmail, validateParticipationDetails } from './validators';

export function useSurveyActions(state: SurveyState, dispatch: Dispatch<SurveyAction>) {
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

  const saveDemographics = useCallback(async () => {
    dispatch({ type: SurveyActionType.SET_LOADING_ENTRIES, payload: true });

    if (!state.demographicsData) {
      dispatch({
        type: SurveyActionType.SET_ERROR,
        payload: 'Demographics data is required.',
      });
      return;
    }

    await new Promise((resolve) => setTimeout(resolve, 500));
    const assignedEntriesCount = state.participationType === 'email' ? 8 : 5;
    const fetchedEntries = await generateDummyEntries(assignedEntriesCount);

    dispatch({ type: SurveyActionType.SET_ENTRIES, payload: fetchedEntries });
  }, [state.demographicsData, state.participationType]);

  const getCurrentDpoEntry = useCallback((): DPOEntry | null => {
    if (state.dpoEntriesToReview.length > 0 && state.currentDpoEntryIndex < state.dpoEntriesToReview.length) {
      return state.dpoEntriesToReview[state.currentDpoEntryIndex];
    }
    return null;
  }, [state.dpoEntriesToReview, state.currentDpoEntryIndex]);

  const submitEvaluation = useCallback(
    (evaluationDraft: EvaluationDraft) => {
      const currentEntry = getCurrentDpoEntry();
      if (!currentEntry || !state.participantSessionUid) {
        dispatch({
          type: SurveyActionType.SET_ERROR,
          payload: 'Error submitting evaluation. No current entry or session UID.',
        });
        return;
      }

      const newEvaluation: EvaluationData = {
        id: crypto.randomUUID(),
        ...evaluationDraft,
        participantSessionUid: state.participantSessionUid,
        dpoEntryCategory: currentEntry.category,
        submittedAt: new Date(),
      };

      dispatch({ type: SurveyActionType.SET_EVALUATION, payload: newEvaluation });
    },
    [getCurrentDpoEntry, state.participantSessionUid],
  );

  const completeSurveyAndPersistData = useCallback(async () => {
    if (!state.participantSessionUid) {
      dispatch({
        type: SurveyActionType.SET_ERROR,
        payload: 'Critical error: No session ID. Cannot save data.',
      });
      return;
    }

    dispatch({ type: SurveyActionType.SET_SUBMITTING, payload: true });

    try {
      const totalTimeSpentMsOnSurvey = state.evaluations.reduce((sum, ev) => sum + (ev.timeSpentMs || 0), 0);

      const participantData: Partial<ParticipantSession> = {
        participationType: state.participationType!,
        email: state.participantEmail || null,
        termsAgreed: state.termsAgreed,
        demographics: state.demographicsData || {},
        assignedEntriesCount: state.dpoEntriesToReview.length,
        completedEntriesCount: state.evaluations.length,
        optedInForPaper: !!state.participantEmail,
        totalTimeSpentMsOnSurvey,
      };

      await persistSurveyData(state.participantSessionUid, participantData, state.evaluations);
      dispatch({ type: SurveyActionType.COMPLETE_SURVEY });
    } catch (error: unknown) {
      dispatch({
        type: SurveyActionType.SET_ERROR,
        payload: `Failed to save responses. Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      });
    } finally {
      dispatch({ type: SurveyActionType.SET_SUBMITTING, payload: false });
    }
  }, [state]);

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
    setParticipationDetails,
    setParticipantEmail,
    updateDemographicsInContext,
    saveDemographics,
    getCurrentDpoEntry,
    submitEvaluation,
    completeSurveyAndPersistData,
    setGlobalError,
    resetSurvey,
    markCurrentEvaluationSubmitted,
    resetCurrentEvaluationSubmitted,
    goToNextStep,
    goToPreviousStep,
    setHasUnsavedChanges,
  };
}
