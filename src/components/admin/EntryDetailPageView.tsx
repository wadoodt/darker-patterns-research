'use client';
import EntryDetailPageContent from '@/components/admin/EntryDetailPageContent';
import type { EntryWithDetails } from '@/types/entryDetails';

interface EntryDetailPageViewProps {
  entry: EntryWithDetails;
}

export default function EntryDetailPageView({ entry }: EntryDetailPageViewProps) {
  return <EntryDetailPageContent entry={entry} />;
}
