// app/(admin)/entries/page.tsx
import EntriesPageContent from '@/components/admin/EntriesPageContent';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Manage DPO Entries' };

export default function AdminEntriesPage() {
  return <EntriesPageContent />;
}
