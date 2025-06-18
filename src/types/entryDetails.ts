import type { DPOEntry } from './dpo';
import type { DemographicsSummary, ResponseAggregates } from './stats';

export interface EntryComment {
  id: string;
  userId: string;
  comment: string;
  createdAt: Date;
}

export interface EntryAnalytics {
  views: number;
  flags: number;
  totalEvaluations: number;
  correctness: number;
  averageRating: number;
  ratingDistribution: Record<number, number>;
  categoryDistribution: Record<string, number>;
}

export interface EntryEvaluationDetail {
  id: string;
  rating: number;
  comment?: string | null;
  categories: string[];
  submittedAt: Date;
  chosenOptionKey: 'A' | 'B';
  wasChosenActuallyAccepted: boolean;
}

export interface EntryWithDetails extends Omit<DPOEntry, 'createdAt' | 'lastReviewedAt'> {
  createdAt: Date;
  lastReviewedAt?: Date;
  analytics: EntryAnalytics;
  comments?: EntryComment[];
  evaluations?: EntryEvaluationDetail[];
  demographics?: DemographicsSummary;
  responseAggregates?: ResponseAggregates;
}
