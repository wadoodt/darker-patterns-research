import type { Timestamp } from 'firebase/firestore';
import type { DPOEntry } from './dpo';
import type { DemographicsSummary, ResponseAggregates } from './stats';

export interface EntryComment {
  id: string;
  userId: string;
  comment: string;
  createdAt: Timestamp | Date;
}

export interface EntryAnalytics {
  views: number;
  flags: number;
  totalEvaluations: number;
  correctness: number;
  averageRating: number;
  ratingDistribution: Record<number, number>;
  categoryDistribution: Record<string, number>;
  lastViewedAt?: Timestamp | Date;
}

export interface EntryWithDetails extends DPOEntry {
  analytics?: EntryAnalytics;
  comments?: EntryComment[];
  evaluations?: Array<{
    id: string;
    rating: number;
    comment?: string | null;
    categories: string[];
    submittedAt: Timestamp | Date;
    chosenOptionKey: 'A' | 'B';
    wasChosenActuallyAccepted: boolean;
  }>;
  demographics?: DemographicsSummary;
  responseAggregates?: ResponseAggregates;
}
