// src/lib/firestore/queries/admin.ts
import type { AdminEntriesFilter, AdminEntriesSortConfig } from '@/hooks/useAdminEntries';
import { db } from '@/lib/firebase';
import { getMockDashboardData, getMockStatisticsData } from '@/lib/firestore/mocks/admin';
import type { DPOEntry, EvaluationData, ParticipantFlag } from '@/types/dpo';
import type { DisplayEntry } from '@/types/entries';
import type { DemographicsSummary, ResponseAggregates } from '@/types/stats';
import {
  collection,
  doc,
  documentId,
  endBefore,
  getCountFromServer,
  getDoc,
  getDocs,
  limit,
  limitToLast,
  orderBy,
  query,
  type Query,
  type QueryDocumentSnapshot,
  startAfter,
  where,
} from 'firebase/firestore';
import { notFound } from 'next/navigation';

export interface AdminSettings {
  minTargetReviewsPerEntry?: number;
  // Add other admin settings as needed
}

export async function getAdminSettings(): Promise<AdminSettings> {
  if (!db) throw new Error('Firebase is not initialized');

  const settingsDocRef = doc(db, 'admin_settings', 'global_config');
  const settingsSnap = await getDoc(settingsDocRef);

  return settingsSnap.exists() ? (settingsSnap.data() as AdminSettings) : {};
}

export interface GetDpoEntryResult {
  entry: DPOEntry;
  evaluations: EvaluationData[];
  flags: ParticipantFlag[];
  demographics?: DemographicsSummary;
  responseAggregates?: ResponseAggregates;
}

export async function getDpoEntry(entryId: string): Promise<GetDpoEntryResult> {
  if (!db) throw new Error('Firebase is not initialized');

  const entryRef = doc(db, 'dpo_entries', entryId);
  const evaluationsQuery = query(
    collection(db, 'evaluations'),
    where('dpoEntryId', '==', entryId),
    orderBy('submittedAt', 'desc'),
  );
  const flagsQuery = query(collection(db, 'participant_flags'), where('dpoEntryId', '==', entryId));
  const statsRef = doc(db, 'stats_demographics', entryId);
  const aggregatesRef = doc(db, 'stats_responses', entryId);

  const [entrySnap, evaluationsSnap, flagsSnap, statsSnap, aggregatesSnap] = await Promise.all([
    getDoc(entryRef),
    getDocs(evaluationsQuery),
    getDocs(flagsQuery),
    getDoc(statsRef),
    getDoc(aggregatesRef),
  ]);

  if (!entrySnap.exists()) {
    notFound();
  }

  const entry = { id: entrySnap.id, ...entrySnap.data() } as DPOEntry;
  const evaluations = evaluationsSnap.docs.map((d) => ({ id: d.id, ...d.data() })) as EvaluationData[];
  const flags = flagsSnap.docs.map((d) => ({ id: d.id, ...d.data() })) as ParticipantFlag[];
  const demographics = statsSnap.data() as DemographicsSummary | undefined;
  const responseAggregates = aggregatesSnap.data() as ResponseAggregates | undefined;

  return { entry, evaluations, flags, demographics, responseAggregates };
}

export function buildDpoEntriesQuery(
  filters: AdminEntriesFilter,
  sort: AdminEntriesSortConfig,
  targetReviews: number,
  pageSize: number,
  pageDirection: 'next' | 'prev' | 'current',
  cursors: {
    first: QueryDocumentSnapshot | null;
    last: QueryDocumentSnapshot | null;
  },
) {
  if (!db) throw new Error('Firebase is not initialized');

  const dpoEntriesRef = collection(db, 'dpo_entries');
  let baseQuery = query(dpoEntriesRef);

  const filterConstraints = [];
  if (filters.category && filters.category.length > 0) {
    filterConstraints.push(where('categories', 'array-contains-any', filters.category.slice(0, 10)));
  } else if (filters.status) {
    if (filters.status === 'needs_reviews') {
      filterConstraints.push(where('reviewCount', '<', targetReviews));
    } else if (filters.status === 'completed') {
      filterConstraints.push(where('reviewCount', '>=', targetReviews));
    }
  }

  if (filterConstraints.length > 0) {
    baseQuery = query(baseQuery, ...filterConstraints);
  }

  if (sort.key) {
    baseQuery = query(baseQuery, orderBy(sort.key, sort.direction));
  }
  if (sort.key !== 'id' && sort.key !== documentId().toString()) {
    baseQuery = query(baseQuery, orderBy(documentId(), sort.direction));
  }

  const countQuery = query(baseQuery);
  let mainQuery = query(baseQuery, limit(pageSize));

  if (pageDirection === 'next' && cursors.last) {
    mainQuery = query(mainQuery, startAfter(cursors.last));
  } else if (pageDirection === 'prev' && cursors.first) {
    mainQuery = query(baseQuery, endBefore(cursors.first), limitToLast(pageSize));
  }

  return { mainQuery, countQuery };
}

export function transformDpoEntry(doc: QueryDocumentSnapshot, targetReviews: number): DisplayEntry {
  const data = doc.data() as DPOEntry;
  const reviewProgress =
    targetReviews > 0 ? Math.min(100, Math.round(((data.reviewCount || 0) / targetReviews) * 100)) : 0;

  return {
    ...data,
    id: doc.id,
    reviewProgress,
    statusText: (data.reviewCount || 0) >= targetReviews ? 'Completed' : `${data.reviewCount || 0}/${targetReviews}`,
  } as DisplayEntry;
}

export async function fetchDpoEntriesCount(countQuery: Query) {
  const countSnapshot = await getCountFromServer(countQuery);
  return countSnapshot.data().count;
}

export async function fetchDpoEntriesData(mainQuery: Query, targetReviews: number) {
  const querySnapshot = await getDocs(mainQuery);
  const entries = querySnapshot.docs.map((doc) => transformDpoEntry(doc, targetReviews));
  return {
    entries,
    cursors: {
      first: querySnapshot.docs[0] || null,
      last: querySnapshot.docs[querySnapshot.docs.length - 1] || null,
    },
  };
}

// A new function for dashboard data
export async function getDashboardData() {
  // For now, let's just return some mock data.
  // We can implement the real data fetching later.
  if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true') {
    return getMockDashboardData();
  }

  // TODO: Replace with real data fetching logic
  return {
    totalEntries: 0,
    totalReviews: 0,
    averageReviews: 0,
    completionPercentage: 0,
  };
}

export async function getStatisticsData() {
  if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true') {
    return getMockStatisticsData();
  }

  // TODO: Replace with real data fetching logic from Firestore
  return {
    demographicsSummary: null,
    overviewStats: null,
    responseAggregates: null,
  };
}
