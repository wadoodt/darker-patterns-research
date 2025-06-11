// app/(info)/ethics-privacy-participation/page.tsx
import EthicsPrivacyContent from '@/components/info/EthicsPrivacyContent';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Ethics, Privacy & Participation' };

export default function EthicsPrivacyParticipationPage() {
  return <EthicsPrivacyContent />;
}
