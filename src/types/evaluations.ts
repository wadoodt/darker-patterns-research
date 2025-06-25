import type { EvaluationData } from './dpo';

export type DisplayEvaluation = Omit<EvaluationData, 'submittedAt'> & {
  id: string;
  dpoEntryInstruction: string; // To give context
  isIncorrect: boolean;
  submittedAt: string; // ISO string for serializing
  agreementRating: number;
};

export type SortableEvaluationKeys =
  | 'dpoEntryId'
  | 'participantSessionUid'
  | 'agreementRating'
  | 'submittedAt'
  | 'chosenOptionKey';
