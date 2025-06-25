// src/lib/firestore/queries/evaluations.ts
import type { AdminEvaluationsFilter, AdminEvaluationsSortConfig } from '@/hooks/useAdminEvaluations';
import { db } from '@/lib/firebase';
import type { DPOEntry, EvaluationData } from '@/types/dpo';
import type { DisplayEvaluation } from '@/types/evaluations';
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
  Timestamp,
  where,
} from 'firebase/firestore';

export function buildEvaluationsQuery(
  filters: AdminEvaluationsFilter,
  sort: AdminEvaluationsSortConfig,
  pageSize: number,
  pageDirection: 'next' | 'prev' | 'current',
  cursors: { first: QueryDocumentSnapshot | null; last: QueryDocumentSnapshot | null },
) {
  if (!db) {
    throw new Error('Firestore not initialized');
  }
  let baseQuery: Query = collection(db, 'evaluations');

  if (filters.showOnlyIncorrect) {
    baseQuery = query(baseQuery, where('wasChosenActuallyAccepted', '==', false));
  }

  if (sort.key) {
    baseQuery = query(baseQuery, orderBy(sort.key, sort.direction), orderBy(documentId(), sort.direction));
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

export async function fetchEvaluationsData(mainQuery: Query) {
  if (!db) {
    throw new Error('Firestore not initialized');
  }

  const evaluationsSnapshot = await getDocs(mainQuery);
  const evaluations: DisplayEvaluation[] = [];

  for (const evaluationDoc of evaluationsSnapshot.docs) {
    const evaluationData = evaluationDoc.data() as EvaluationData;
    const entryDocRef = doc(db, 'dpo_entries', evaluationData.dpoEntryId);
    const entryDoc = await getDoc(entryDocRef);
    const dpoEntryInstruction = entryDoc.exists() ? (entryDoc.data() as DPOEntry).instruction : 'Unknown Entry';

    evaluations.push({
      ...(evaluationData as Omit<EvaluationData, 'submittedAt'>),
      id: evaluationDoc.id,
      submittedAt: (evaluationData.submittedAt as Timestamp).toDate().toISOString(),
      dpoEntryInstruction,
      isIncorrect: !evaluationData.wasChosenActuallyAccepted,
      agreementRating: evaluationData.agreementRating,
    });
  }

  return {
    evaluations,
    first: evaluationsSnapshot.docs[0] ?? null,
    last: evaluationsSnapshot.docs[evaluationsSnapshot.docs.length - 1] ?? null,
  };
}

export async function fetchEvaluationsCount(countQuery: Query) {
  const countSnapshot = await getCountFromServer(countQuery);
  return countSnapshot.data().count;
}
