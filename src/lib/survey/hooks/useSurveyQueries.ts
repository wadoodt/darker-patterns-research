import type { DPOEntry } from '@/types/dpo';
import type { SurveyState } from '@/types/survey';
import type { Dispatch } from 'react';
import { useCallback } from 'react';
import { SurveyAction, SurveyActionType } from '../actions';
import { fetchAndAssignEntries } from '../database';
import { getAssignedEntriesCount, getCurrentEntry } from '../surveyUtils';

export function useSurveyQueries(state: SurveyState, dispatch: Dispatch<SurveyAction>) {
  const getCurrentDpoEntry = useCallback((): DPOEntry | null => {
    return getCurrentEntry(state.dpoEntriesToReview, state.currentDpoEntryIndex);
  }, [state.dpoEntriesToReview, state.currentDpoEntryIndex]);

  const saveDemographics = useCallback(async () => {
    dispatch({ type: SurveyActionType.SET_LOADING_ENTRIES, payload: true });

    try {
      if (!state.demographicsData) {
        throw new Error('Demographics data is required to fetch entries.');
      }

      const assignedEntriesCount = getAssignedEntriesCount(state.participationType);
      const fetchedEntries: DPOEntry[] = await fetchAndAssignEntries(assignedEntriesCount);

      dispatch({ type: SurveyActionType.SET_ENTRIES, payload: fetchedEntries });
    } catch (error) {
      console.error('Failed to save demographics and fetch entries:', error);
      dispatch({
        type: SurveyActionType.SET_ERROR,
        payload: error instanceof Error ? error.message : 'An unknown error occurred.',
      });
    } finally {
      dispatch({ type: SurveyActionType.SET_LOADING_ENTRIES, payload: false });
    }
  }, [state.demographicsData, state.participationType, dispatch]);

  return {
    getCurrentDpoEntry,
    saveDemographics,
  };
}
