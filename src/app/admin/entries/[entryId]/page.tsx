import EntryDetailPageContent from '@/components/admin/EntryDetailPageContent';
import { getEntry } from '@/lib/entries';
import { getMockEntryDetails } from '@/lib/mocks/entryDetails';
import type { EntryWithDetails } from '@/types/entryDetails';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: { entryId: string } }): Promise<Metadata> {
  return {
    title: `Entry Details: ${params.entryId}`,
  };
}

export default async function EntryDetailRoutePage({ params }: { params: { entryId: string } }) {
  let entryData: EntryWithDetails;

  if (process.env.NODE_ENV === 'test') {
    entryData = getMockEntryDetails(params.entryId);
  } else {
    const { entry, evaluations, flags, demographics, responseAggregates } = await getEntry(params.entryId);

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

  return <EntryDetailPageContent entry={entryData} />;
}
