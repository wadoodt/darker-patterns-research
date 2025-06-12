import type { DPOEntry } from '@/types/dpo';
import type { SurveyState } from '@/types/survey';
import type { Dispatch } from 'react';
import { useCallback } from 'react';
import { SurveyAction, SurveyActionType } from '../actions';
import { generateDummyEntries } from '../database';
import { getAssignedEntriesCount, getCurrentEntry } from '../surveyUtils';

export function useSurveyQueries(state: SurveyState, dispatch: Dispatch<SurveyAction>) {
  const getCurrentDpoEntry = useCallback((): DPOEntry | null => {
    return getCurrentEntry(state.dpoEntriesToReview, state.currentDpoEntryIndex);
  }, [state.dpoEntriesToReview, state.currentDpoEntryIndex]);

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
    const assignedEntriesCount = getAssignedEntriesCount(state.participationType);
    const fetchedEntries = await generateDummyEntries(assignedEntriesCount);

    dispatch({ type: SurveyActionType.SET_ENTRIES, payload: fetchedEntries });
  }, [state.demographicsData, state.participationType, dispatch]);

  return {
    getCurrentDpoEntry,
    saveDemographics,
  };
}
