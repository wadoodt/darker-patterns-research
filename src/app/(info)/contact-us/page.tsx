// app/(info)/contact-us/page.tsx
import ContactUsContent from '@/components/info/ContactUsContent';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Contact Us' };

export default function ContactUsPage() {
  return <ContactUsContent />;
}
