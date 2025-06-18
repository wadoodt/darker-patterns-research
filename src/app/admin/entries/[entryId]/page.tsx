import EntryDetailPageView from '@/components/admin/EntryDetailPageView';
import { getDpoEntry, incrementEntryViewCount } from '@/lib/firestore/queries/admin';
import type { EntryWithDetails } from '@/types/entryDetails';
import { Timestamp } from 'firebase/firestore';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: { entryId: string } }): Promise<Metadata> {
  const { entryId } = await params;
  return {
    title: `Entry Details: ${entryId}`,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function convertTimestamp(field: Date | Timestamp): any {
  if (field instanceof Timestamp) {
    return field.toDate();
  }
  return field;
}

export default async function EntryDetailRoutePage({ params }: { params: { entryId: string } }) {
  const { entryId } = params;

  // Increment the view count and then fetch the data
  await incrementEntryViewCount(entryId);
  const { entry, evaluations, flags } = await getDpoEntry(entryId);

  // Convert Firestore Timestamps to Date objects
  const processedEntry = Object.fromEntries(
    Object.entries(entry).map(([key, value]) => [key, convertTimestamp(value)]),
  ) as typeof entry;

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
        e.categories.forEach((category) => {
          acc[category] = (acc[category] || 0) + 1;
        });
      }
      return acc;
    },
    {} as Record<string, number>,
  );

  const entryData: EntryWithDetails = {
    ...processedEntry,
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
    // TODO: Add comments when available
  };

  return <EntryDetailPageView entry={entryData} />;
}
