import ActivityItem from '@/components/admin/ActivityItem';
import AdminHeader from '@/components/admin/AdminHeader';
import ChartPlaceholder from '@/components/admin/ChartPlaceholder';
import DemographicsChartAdmin from '@/components/admin/DemographicsChartAdmin';
import StatCardAdmin from '@/components/admin/StatCardAdmin';
import { BarChartHorizontalBig, CheckCircle, CheckSquare, Clock, Flag, PieChart, UserPlus, Users } from 'lucide-react';
import type { Metadata } from 'next';
import {
  getOverviewStats,
  getDemographicsData,
  getRecentActivity,
  getProjectProgressData,
} from '@/lib/firestore/queries/dashboard';
import type { DashboardData, RecentActivityItem } from '@/types/dpo';

export const metadata: Metadata = { title: 'Project Overview - DPV Admin' };

// Helper function to safely calculate percentage
const calculatePercentage = (part?: number, total?: number): number => {
  if (typeof part !== 'number' || typeof total !== 'number' || total === 0) {
    return 0;
  }
  return Math.round((part / total) * 100);
};

function StatsCardSection({ data }: { data: Partial<DashboardData> }) {
  const completionPercent = calculatePercentage(data.entriesCompleted, data.totalEntries);
  return (
    <section className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
      <StatCardAdmin
        title="Total Entries"
        value={(data.totalEntries ?? 0).toLocaleString()}
        icon={<BarChartHorizontalBig className="text-dark-text-secondary" size={24} />}
        progressPercent={100}
        progressColor="bg-brand-purple-500"
      />
      <StatCardAdmin
        title="Entries Completed"
        value={`${(data.entriesCompleted ?? 0).toLocaleString()}`}
        valueSecondary={`/ ${completionPercent}%`}
        valueSecondaryColor="stat-card-value-secondary"
        icon={<CheckCircle className="text-green-500" size={24} />}
        progressPercent={completionPercent}
        progressColor="bg-green-500"
      />
      <StatCardAdmin
        title="Avg. Time / Entry"
        value={`${data.avgTimePerEntry ?? 'N/A'}s`}
        icon={<Clock className="text-dark-text-secondary" size={24} />}
      />
      <StatCardAdmin
        title="Active Participants"
        value={(data.activeParticipants ?? 0).toLocaleString()}
        icon={<Users className="text-dark-text-secondary" size={24} />}
      />
    </section>
  );
}

function ChartsSection({ data }: { data: Partial<DashboardData> }) {
  return (
    <section className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="admin-card lg:col-span-2">
        <h2 className="text-dark-text-primary mb-4 text-xl font-semibold">Project Progress Overview</h2>
        {data.projectProgress && data.projectProgress.length > 0 ? (
          <div className="h-72 rounded-md bg-gray-800 p-2">
            <pre className="h-full overflow-auto text-xs text-white">
              {JSON.stringify(data.projectProgress, null, 2)}
            </pre>
          </div>
        ) : (
          <ChartPlaceholder
            description="Visual representation of data entries over time, highlighting milestones and completion trends."
            height="h-72"
            icon={<PieChart className="chart-placeholder-icon" />}
          />
        )}
      </div>
      <div className="admin-card">
        <h2 className="text-dark-text-primary mb-4 text-xl font-semibold">Participant Demographics</h2>
        {data.demographics && (data.demographics.age.length > 0 || data.demographics.technicalBackground.length > 0) ? (
          <div className="h-72 rounded-md bg-gray-800 p-2">
            <pre className="h-full overflow-auto text-xs text-white">{JSON.stringify(data.demographics, null, 2)}</pre>
          </div>
        ) : (
          <DemographicsChartAdmin ageData={[]} techBgData={[]} />
        )}
      </div>
    </section>
  );
}

const getActivityIcon = (type: RecentActivityItem['type']) => {
  switch (type) {
    case 'evaluation':
      return { Icon: CheckSquare, color: 'text-green-500' };
    case 'flag':
      return { Icon: Flag, color: 'text-yellow-400' };
    case 'new_participant':
      return { Icon: UserPlus, color: 'text-blue-400' };
    default:
      return { Icon: CheckSquare, color: 'text-gray-500' };
  }
};

function RecentActivitySection({ data }: { data: Partial<DashboardData> }) {
  return (
    <section>
      <h2 className="text-dark-text-primary mb-5 text-xl font-bold sm:mb-6 sm:text-2xl">Recent Activity</h2>
      <div className="admin-card p-0">
        {data.recentActivity && data.recentActivity.length > 0 ? (
          <ul className="activity-list">
            {data.recentActivity.map((activity) => {
              const { Icon, color } = getActivityIcon(activity.type);
              return (
                <ActivityItem
                  key={activity.id}
                  icon={<Icon size={20} className={color} />}
                  text={activity.description}
                  time={new Date(activity.timestamp).toLocaleString()}
                />
              );
            })}
          </ul>
        ) : (
          <div className="text-dark-text-secondary p-6 text-center">No recent activity.</div>
        )}
      </div>
    </section>
  );
}

export default async function ProjectOverviewPage() {
  const overviewStats = await getOverviewStats();
  const demographicsData = await getDemographicsData();
  const recentActivityData = await getRecentActivity();
  const projectProgressData = await getProjectProgressData();

  const dashboardData: Partial<DashboardData> = {
    ...overviewStats,
    ...demographicsData,
    ...recentActivityData,
    ...projectProgressData,
  };

  return (
    <>
      <AdminHeader
        title="Dark Pattern in LLMs - DPO dataset human Validation"
        objective="Objective: Validate a dataset for detecting dark patterns in Large Language Models through human evaluation."
      />
      <StatsCardSection data={dashboardData} />
      <ChartsSection data={dashboardData} />
      <RecentActivitySection data={dashboardData} />
    </>
  );
}
