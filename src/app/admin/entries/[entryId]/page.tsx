import { notFound } from 'next/navigation';
import EntryDetailPageView from '@/components/admin/EntryDetailPageView';
import { incrementEntryViewCount } from '@/lib/firestore/queries/admin';
import { getEntryDetails } from '@/lib/callable-functions';

export const dynamic = 'force-dynamic';
export const revalidate = 60; // Revalidate every 60 seconds

type EntryDetailRoutePageProps = {
  params: { entryId: string };
};

export async function generateMetadata({ params }: EntryDetailRoutePageProps) {
  const entryId = params.entryId;
  return {
    title: `Entry Details: ${entryId}`,
  };
}

export default async function EntryDetailRoutePage({ params }: EntryDetailRoutePageProps) {
  const { entryId } = params;

  // Don't try to fetch data during static generation
  if (typeof window === 'undefined') {
    return <div>Loading...</div>;
  }

  try {
    // Run these in parallel for better performance
    const [entryData] = await Promise.all([
      // Get entry details first
      getEntryDetails(entryId),
      // Increment view count (fire and forget)
      incrementEntryViewCount(entryId).catch(console.error),
    ]);

    return <EntryDetailPageView entry={entryData} />;
  } catch (error) {
    console.error('Error in EntryDetailRoutePage:', error);
    return notFound();
  }
}
