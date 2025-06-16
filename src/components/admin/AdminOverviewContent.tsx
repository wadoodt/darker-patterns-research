// components/admin/AdminOverviewContent.tsx
import { getDashboardData } from '@/lib/firestore/queries/admin';
import { BookOpen, ClipboardCheck, Percent, Users } from 'lucide-react';
import React from 'react';
import AdminHeader from './AdminHeader';
import { StatCard } from './StatCard';

const AdminOverviewContent = async () => {
  const dashboardData = await getDashboardData();

  return (
    <>
      <AdminHeader
        title="Dark Pattern Validator - Project Overview"
        objective="Dashboard providing a summary of DPO dataset validation progress, key statistics, and recent activity."
      />
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total DPO Entries"
          value={dashboardData.totalEntries.toLocaleString()}
          icon={BookOpen}
          iconColorClass="text-brand-purple-400"
        />
        <StatCard
          title="Total Human Reviews"
          value={dashboardData.totalReviews.toLocaleString()}
          icon={ClipboardCheck}
          iconColorClass="text-accent-cyan"
        />
        <StatCard
          title="Avg Reviews per Entry"
          value={dashboardData.averageReviews.toFixed(1)}
          icon={Users}
          iconColorClass="text-accent-pink"
        />
        <StatCard
          title="Dataset Completion"
          value={`${dashboardData.completionPercentage}%`}
          icon={Percent}
          iconColorClass="text-green-500"
        />
      </div>
      <div className="mt-6 space-y-6">
        <p className="text-dark-text-secondary">(Additional charts and activity feed will go here)</p>
      </div>
    </>
  );
};
export default AdminOverviewContent;
