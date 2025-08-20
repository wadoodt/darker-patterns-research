// app/(info)/researchers/page.tsx
import ResearchersContent from '@/components/info/ResearchersContent';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Meet the Researchers' };

export default function ResearchersPage() {
  return <ResearchersContent />;
}
