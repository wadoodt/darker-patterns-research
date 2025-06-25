import type { EvaluationData } from './dpo';

export type DisplayEvaluation = Omit<EvaluationData, 'submittedAt'> & {
  id: string;
  dpoEntryInstruction: string; // To give context
  isIncorrect: boolean;
  submittedAt: string; // ISO string for serializing
};

export type SortableEvaluationKeys =
  | 'dpoEntryId'
  | 'participantSessionUid'
  | 'rating'
  | 'submittedAt'
  | 'chosenOptionKey';
