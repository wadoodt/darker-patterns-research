// app/(info)/terms-conditions/page.tsx
import TermsConditionsContent from '@/components/info/TermsConditionsContent';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Terms & Conditions' };

export default function TermsConditionsPage() {
  return <TermsConditionsContent />;
}
