import type { SurveyState } from '@/types/survey';
import type { Dispatch } from 'react';
import { SurveyAction } from './actions';
import { useSurveyMutations } from './hooks/useSurveyMutations';
import { useSurveyNavigationMutations } from './hooks/useSurveyNavigationMutations';
import { useSurveyQueries } from './hooks/useSurveyQueries';

export function useSurveyActions(state: SurveyState, dispatch: Dispatch<SurveyAction>) {
  const mutations = useSurveyMutations(state, dispatch);
  const navigationMutations = useSurveyNavigationMutations(state, dispatch);
  const queries = useSurveyQueries(state, dispatch);

  return {
    ...mutations,
    ...navigationMutations,
    ...queries,
  };
}
