// app/(info)/benefits/page.tsx
import BenefitsContent from '@/components/info/BenefitsContent';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Benefits of Participation' };

export default function BenefitsPage() {
  return <BenefitsContent />;
}
