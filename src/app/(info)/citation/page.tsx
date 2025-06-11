// app/(info)/citation/page.tsx
import CitationContent from '@/components/info/CitationContent';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'How to Cite' };

export default function CitationPage() {
  return <CitationContent />;
}
