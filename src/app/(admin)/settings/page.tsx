// app/(admin)/settings/page.tsx
import AdminSettingsContent from '@/components/admin/AdminSettingsContent';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Admin Settings' };

export default function AdminSettingsPage() {
  return <AdminSettingsContent />;
}
