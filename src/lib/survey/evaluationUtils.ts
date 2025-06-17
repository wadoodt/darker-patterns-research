import type { DemographicData, DPOEntry, EvaluationData, EvaluationDraft, ParticipantSession } from '@/types/dpo';

export function calculateTotalTimeSpent(evaluations: EvaluationData[]): number {
  return evaluations.reduce((sum, ev) => sum + (ev.timeSpentMs || 0), 0);
}

export function buildParticipantData(
  participationType: 'email' | 'anonymous',
  email: string | null,
  termsAgreed: boolean,
  demographicsData: DemographicData | null,
  dpoEntriesToReview: DPOEntry[],
  evaluations: EvaluationData[],
  timeSpentMs: number,
): Partial<ParticipantSession> {
  return {
    participationType,
    email: email || null,
    termsAgreed,
    demographics: demographicsData || {},
    assignedEntriesCount: dpoEntriesToReview.length,
    completedEntriesCount: evaluations.length,
    optedInForPaper: !!email,
    totalTimeSpentMsOnSurvey: timeSpentMs,
  };
}

export function createNewEvaluation(
  evaluationDraft: EvaluationDraft,
  participantSessionUid: string,
  dpoEntry: DPOEntry,
): EvaluationData {
  return {
    id: crypto.randomUUID(),
    ...evaluationDraft,
    participantSessionUid,
    dpoEntryCategories: dpoEntry.categories,
    submittedAt: new Date(),
  };
}
