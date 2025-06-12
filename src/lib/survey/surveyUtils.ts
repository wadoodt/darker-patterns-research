import type { DPOEntry } from '@/types/dpo';
import type { Dispatch } from 'react';
import { SurveyActionType, type SurveyAction } from './actions';

export function handleDispatchError(dispatch: Dispatch<SurveyAction>, error: unknown) {
  dispatch({
    type: SurveyActionType.SET_ERROR,
    payload: `Failed to save responses. Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
  });
}

export function getCurrentEntry(dpoEntriesToReview: DPOEntry[], currentIndex: number): DPOEntry | null {
  if (dpoEntriesToReview.length > 0 && currentIndex < dpoEntriesToReview.length) {
    return dpoEntriesToReview[currentIndex];
  }
  return null;
}

export function getAssignedEntriesCount(participationType: 'email' | 'anonymous' | null): number {
  return participationType === 'email' ? 8 : 5;
}

export function validateSessionExists(sessionUid: string | null, dispatch: Dispatch<SurveyAction>): boolean {
  if (!sessionUid) {
    dispatch({
      type: SurveyActionType.SET_ERROR,
      payload: 'Critical error: No session ID. Cannot save data.',
    });
    return false;
  }
  return true;
}
