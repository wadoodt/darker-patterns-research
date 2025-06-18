import type { DPOEntry, EvaluationData, ParticipantFlag } from './types';
import type { EntryWithDetails } from '../../src/types/entryDetails';
import { Timestamp } from 'firebase-admin/firestore';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function convertTimestamp(field: any): any {
  if (field instanceof Timestamp) {
    return field.toDate();
  }
  return field;
}

export function processEntryDetails(
  entry: DPOEntry,
  evaluations: EvaluationData[],
  flags: ParticipantFlag[],
): EntryWithDetails {
  const processedEntry = Object.fromEntries(
    Object.entries(entry).map(([key, value]) => [key, convertTimestamp(value)]),
  );

  const totalEvaluations = evaluations.length;
  const correctEvaluations = evaluations.filter((e) => e.wasChosenActuallyAccepted).length;
  const ratingDistribution = evaluations.reduce(
    (acc, e) => {
      acc[e.rating] = (acc[e.rating] || 0) + 1;
      return acc;
    },
    {} as Record<number, number>,
  );
  const totalRating = evaluations.reduce((acc, e) => acc + e.rating, 0);
  const averageRating = totalEvaluations > 0 ? totalRating / totalEvaluations : 0;

  const categoryDistribution = evaluations.reduce(
    (acc, e) => {
      if (e.categories) {
        e.categories.forEach((category: string) => {
          acc[category] = (acc[category] || 0) + 1;
        });
      }
      return acc;
    },
    {} as Record<string, number>,
  );

  const result = {
    ...(processedEntry as DPOEntry),
    analytics: {
      views: entry.viewCount || 1,
      flags: flags.length,
      totalEvaluations,
      correctness: totalEvaluations > 0 ? (correctEvaluations / totalEvaluations) * 100 : 0,
      averageRating,
      ratingDistribution,
      categoryDistribution,
    },
    evaluations: evaluations
      .filter((e) => e.id)
      .map((e) => ({
        id: e.id!,
        rating: e.rating,
        comment: e.comment,
        categories: e.categories,
        submittedAt: convertTimestamp(e.submittedAt),
        chosenOptionKey: e.chosenOptionKey,
        wasChosenActuallyAccepted: e.wasChosenActuallyAccepted,
      })),
  };

  return result as EntryWithDetails;
}
