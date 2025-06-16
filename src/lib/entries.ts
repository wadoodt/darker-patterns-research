import type { AdminEntriesFilter, AdminEntriesSortConfig } from '@/hooks/useAdminEntries';
import { db } from '@/lib/firebase';
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
  QueryDocumentSnapshot,
  startAfter,
  where,
} from 'firebase/firestore';
import { notFound } from 'next/navigation';

interface GetEntryResult {
  entry: DPOEntry;
  evaluations: EvaluationData[];
  flags: ParticipantFlag[];
  demographics?: DemographicsSummary;
  responseAggregates?: ResponseAggregates;
}

export async function getEntry(entryId: string): Promise<GetEntryResult> {
  try {
    if (!db) throw new Error('Firebase is not initialized');

    // Get entry document
    const entryRef = doc(db, 'dpo_entries', entryId);
    const entrySnap = await getDoc(entryRef);

    if (!entrySnap.exists()) {
      notFound();
    }

    const entry = { id: entrySnap.id, ...entrySnap.data() } as DPOEntry;

    // Get evaluations
    const evaluationsQuery = query(
      collection(db, 'evaluations'),
      where('dpoEntryId', '==', entryId),
      orderBy('submittedAt', 'desc'),
    );
    const evaluationsSnap = await getDocs(evaluationsQuery);
    const evaluations = evaluationsSnap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as EvaluationData[];

    // Get flags
    const flagsQuery = query(collection(db, 'participant_flags'), where('dpoEntryId', '==', entryId));
    const flagsSnap = await getDocs(flagsQuery);
    const flags = flagsSnap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as ParticipantFlag[];

    // Get analytics
    const statsRef = doc(db, 'stats_demographics', entryId);
    const statsSnap = await getDoc(statsRef);
    const demographics = statsSnap.data() as DemographicsSummary | undefined;

    const aggregatesRef = doc(db, 'stats_responses', entryId);
    const aggregatesSnap = await getDoc(aggregatesRef);
    const responseAggregates = aggregatesSnap.data() as ResponseAggregates | undefined;

    return {
      entry,
      evaluations,
      flags,
      demographics,
      responseAggregates,
    };
  } catch (error) {
    console.error('Error fetching entry:', error);
    throw error;
  }
}

export function buildEntriesQuery(
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

  // Apply filters
  const filterConstraints = [];
  if (filters.category && filters.category.length > 0) {
    if (filters.category.length > 10) {
      console.warn('Category filter is limited to 10 selections, taking the first 10.');
      filters.category = filters.category.slice(0, 10);
    }
    filterConstraints.push(where('categories', 'array-contains-any', filters.category));
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

  // Apply sorting
  if (sort.key) {
    baseQuery = query(baseQuery, orderBy(sort.key, sort.direction));
  }

  if (sort.key !== 'id' && sort.key !== documentId().toString()) {
    baseQuery = query(baseQuery, orderBy(documentId(), sort.direction));
  }

  // Apply pagination
  if (pageDirection === 'next' && cursors.last) {
    baseQuery = query(baseQuery, startAfter(cursors.last));
  } else if (pageDirection === 'prev' && cursors.first) {
    baseQuery = query(baseQuery, endBefore(cursors.first), limitToLast(pageSize));
  }

  return {
    mainQuery: query(baseQuery, limit(pageSize)),
    countQuery: query(baseQuery),
  };
}

export function transformEntryData(doc: QueryDocumentSnapshot, targetReviews: number): DisplayEntry {
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

export async function fetchEntriesCount(query: ReturnType<typeof buildEntriesQuery>['countQuery']) {
  const countSnapshot = await getCountFromServer(query);
  return countSnapshot.data().count;
}

export async function fetchEntriesData(
  query: ReturnType<typeof buildEntriesQuery>['mainQuery'],
  targetReviews: number,
) {
  const querySnapshot = await getDocs(query);

  return {
    entries: querySnapshot.docs.map((doc) => transformEntryData(doc, targetReviews)),
    cursors: {
      first: querySnapshot.docs[0] || null,
      last: querySnapshot.docs[querySnapshot.docs.length - 1] || null,
    },
  };
}
