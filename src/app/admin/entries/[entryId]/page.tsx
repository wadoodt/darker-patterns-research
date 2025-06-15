import EntryDetailPageView from '@/components/admin/EntryDetailPageView';
import { getEntry } from '@/lib/entries';
import { getMockEntryDetails } from '@/lib/mocks/entryDetails';
import type { EntryWithDetails } from '@/types/entryDetails';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: { entryId: string } }): Promise<Metadata> {
  const { entryId } = await params;
  return {
    title: `Entry Details: ${entryId}`,
  };
}

export default async function EntryDetailRoutePage({ params }: { params: Promise<{ entryId: string }> }) {
  const { entryId } = await params;
  let entryData: EntryWithDetails;

  if (process.env.NODE_ENV === 'development') {
    entryData = getMockEntryDetails(entryId);
  } else {
    const { entry, evaluations, flags, demographics, responseAggregates } = await getEntry(entryId);

    const formattedEvaluations = evaluations.map((evaluation) => ({
      id: evaluation.id ?? evaluation.dpoEntryId, // Fallback to dpoEntryId if id is undefined
      rating: evaluation.rating,
      comment: evaluation.comment,
      submittedAt: evaluation.submittedAt,
      chosenOptionKey: evaluation.chosenOptionKey,
      wasChosenActuallyAccepted: evaluation.wasChosenActuallyAccepted,
    }));

    entryData = {
      ...entry,
      analytics: {
        views: 0, // TODO: Implement view tracking
        flags: flags.length,
        upvotes: responseAggregates?.ratingDistribution?.['5_star'] || 0,
      },
      evaluations: formattedEvaluations,
      demographics,
      responseAggregates,
    } as EntryWithDetails;
  }

  return <EntryDetailPageView entry={entryData} />;
}
