// contexts/SurveyProgressContext.tsx
'use client';

import type { ReactNode } from 'react';
import { createContext, useContext, useEffect, useReducer } from 'react';
import { useSurveyActions } from '../lib/survey/hooks';
import { initialState, surveyReducer } from '../lib/survey/reducer';
import type { SurveyContextValue } from '../types/survey';

const SurveyProgressContext = createContext<SurveyContextValue | undefined>(undefined);

export const SurveyProgressProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(surveyReducer, initialState);
  const actions = useSurveyActions(state, dispatch);

  useEffect(() => {
    if (!state.participantSessionUid) {
      actions.resetSurvey();
    }
  }, [state.participantSessionUid, actions]);

  return (
    <SurveyProgressContext.Provider
      value={{
        ...state,
        ...actions,
      }}
    >
      {children}
    </SurveyProgressContext.Provider>
  );
};

export const useSurveyProgress = (): SurveyContextValue => {
  const context = useContext(SurveyProgressContext);
  if (context === undefined) {
    throw new Error('useSurveyProgress must be used within a SurveyProgressProvider');
  }
  return context;
};
