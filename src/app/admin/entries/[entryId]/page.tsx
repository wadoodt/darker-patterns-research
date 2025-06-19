import EntryDetailPageView from '@/components/admin/EntryDetailPageView';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';
export const revalidate = 60; // Revalidate every 60 seconds

// Correctly type the props for a Page component in the App Router
type EntryDetailRoutePageProps = {
  params: { entryId: string };
};

// This function can remain on the server to generate metadata
export async function generateMetadata({ params }: EntryDetailRoutePageProps) {
  const { entryId } = await params;
  return {
    title: `Entry Details: ${entryId}`,
  };
}

// This is now a standard Server Component that renders a Client Component.
export default async function EntryDetailRoutePage({ params }: EntryDetailRoutePageProps) {
  const { entryId } = await params;

  if (!entryId) {
    console.error({ params, entryId, paco: params.entryId });
    return notFound();
  }

  // The EntryDetailPageView component will handle its own data fetching on the client.
  return <EntryDetailPageView entryId={entryId} />;
}
