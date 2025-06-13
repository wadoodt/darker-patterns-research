// app/(admin)/statistics/page.tsx
import AdminStatisticsContent from '@/components/admin/AdminStatisticsContent';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Survey Statistics' };

export default function AdminStatisticsPage() {
  return <AdminStatisticsContent />;
}
