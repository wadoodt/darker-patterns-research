// app/(info)/about-research/page.tsx
import AboutResearchContent from '@/components/info/AboutResearchContent';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'About Our Research' };

export default function AboutResearchPage() {
  return <AboutResearchContent />;
}
