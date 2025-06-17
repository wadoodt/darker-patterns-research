import EntryDetailPageView from '@/components/admin/EntryDetailPageView';
import { getDpoEntry } from '@/lib/firestore/queries/admin';
import type { EntryWithDetails } from '@/types/entryDetails';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: { entryId: string } }): Promise<Metadata> {
  const { entryId } = await params;
  return {
    title: `Entry Details: ${entryId}`,
  };
}

export default async function EntryDetailRoutePage({ params }: { params: { entryId: string } }) {
  const { entryId } = await params;
  const { entry, evaluations, flags } = await getDpoEntry(entryId);

  const entryData: EntryWithDetails = {
    ...entry,
    analytics: {
      views: 0, // TODO: Implement view tracking
      flags: flags.length,
      upvotes: evaluations.filter((e) => e.rating === 5).length,
    },
    evaluations: evaluations
      .filter((e) => e.id)
      .map((e) => ({
        id: e.id!,
        rating: e.rating,
        comment: e.comment,
        submittedAt: e.submittedAt,
        chosenOptionKey: e.chosenOptionKey,
        wasChosenActuallyAccepted: e.wasChosenActuallyAccepted,
      })),
    // TODO: Add comments when available
  };

  return <EntryDetailPageView entry={entryData} />;
}
