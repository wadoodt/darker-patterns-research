// app/(admin)/overview/page.tsx
import type { Metadata } from 'next';
import AdminHeader from '@/components/admin/AdminHeader';
import StatCardAdmin from '@/components/admin/StatCardAdmin';
import ChartPlaceholder from '@/components/admin/ChartPlaceholder';
import DemographicsChartAdmin from '@/components/admin/DemographicsChartAdmin';
import ActivityItem from '@/components/admin/ActivityItem';
import {
  BarChartHorizontalBig,
  CheckCircle,
  Clock,
  Users,
  TrendingUp,
  PieChart,
  CheckSquare,
  Flag,
  UserPlus,
} from 'lucide-react';

// Dummy data - this would eventually come from Firebase/backend/context
const overviewStaticData = {
  totalEntries: 1500,
  entriesCompleted: 675,
  avgTimePerEntry: '3m 15s',
  avgTimeTarget: '3m 00s',
  activeParticipants: 25,
  activeParticipantsChange: '+2 this week',
  demographics: {
    age: [
      { range: '18-24', percent: 30, color: 'bg-brand-purple-500' },
      { range: '25-34', percent: 45, color: 'bg-brand-purple-600' },
      { range: '35-44', percent: 15, color: 'bg-brand-purple-700' },
      { range: '45+', percent: 10, color: 'bg-brand-purple-800' },
    ],
    technicalBackground: [
      { label: 'Technical Background: Yes', percent: 60, color: 'bg-green-500' },
      { label: 'Technical Background: No', percent: 40, color: 'bg-red-500' },
    ],
  },
  recentActivity: [
    {
      id: 1,
      iconType: CheckSquare,
      text: 'Entry #675 completed by Participant_012',
      time: '2 minutes ago',
      actionText: 'View Entry',
      actionLink: '#',
      iconColor: 'text-green-500',
    },
    {
      id: 2,
      iconType: Flag,
      text: 'Entry #672 flagged for review by Participant_008',
      time: '15 minutes ago',
      actionText: 'Review Flag',
      actionLink: '#',
      iconColor: 'text-yellow-400',
    },
    {
      id: 3,
      iconType: UserPlus,
      text: 'Participant_026 joined the project',
      time: '1 hour ago',
      actionText: 'View Profile',
      actionLink: '#',
      iconColor: 'text-blue-400',
    },
    {
      id: 4,
      iconType: CheckSquare,
      text: 'Entry #670 completed by Participant_005',
      time: '3 hours ago',
      actionText: 'View Entry',
      actionLink: '#',
      iconColor: 'text-green-500',
    },
  ],
};

export const metadata: Metadata = { title: 'Project Overview - DPV Admin' };

export default function ProjectOverviewPage() {
  const completionPercent = Math.round((overviewStaticData.entriesCompleted / overviewStaticData.totalEntries) * 100);

  return (
    <>
      {' '}
      {/* AdminDashboardLayout already provides the main flex container */}
      <AdminHeader
        title="Dark Pattern in LLMs - DPO dataset human Validation"
        objective="Objective: Validate a dataset for detecting dark patterns in Large Language Models through human evaluation."
        // className="mb-8 sm:mb-10" // Spacing is handled by AdminHeader's internal class
      />
      {/* Stats Cards Section */}
      <section className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
        <StatCardAdmin
          title="Total Entries"
          value={overviewStaticData.totalEntries.toLocaleString()}
          icon={<BarChartHorizontalBig className="text-dark-text-secondary" size={24} />}
          progressPercent={100} // Assuming total is always 100% for itself
          progressColor="bg-brand-purple-500"
        />
        <StatCardAdmin
          title="Entries Completed"
          value={`${overviewStaticData.entriesCompleted.toLocaleString()}`}
          valueSecondary={`/ ${completionPercent}%`}
          valueSecondaryColor="stat-card-value-secondary" // Uses the CSS class for styling
          icon={<CheckCircle className="text-green-500" size={24} />}
          progressPercent={completionPercent}
          progressColor="bg-green-500"
        />
        <StatCardAdmin
          title="Avg. Time / Entry"
          value={overviewStaticData.avgTimePerEntry}
          icon={<Clock className="text-dark-text-secondary" size={24} />}
          footerText={`Target: ${overviewStaticData.avgTimeTarget}`}
          footerIcon={<TrendingUp className="text-yellow-500" size={16} />} // Lucide icon directly
          footerColor="text-yellow-500"
        />
        <StatCardAdmin
          title="Active Participants"
          value={overviewStaticData.activeParticipants.toLocaleString()}
          icon={<Users className="text-dark-text-secondary" size={24} />}
          footerText={`${overviewStaticData.activeParticipantsChange.split(' ')[0]} ${overviewStaticData.activeParticipantsChange.split(' ')[1]}`}
          footerIcon={<TrendingUp className="text-green-500" size={16} />} // Corrected icon usage
          footerColor="text-green-500"
        />
      </section>
      {/* Main Content Sections (Charts) */}
      <section className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="admin-card lg:col-span-2">
          <h2 className="text-dark-text-primary mb-4 text-xl font-semibold">Project Progress Overview</h2>
          <ChartPlaceholder
            description="Visual representation of data entries over time, highlighting milestones and completion trends."
            height="h-72"
            icon={<PieChart className="chart-placeholder-icon" />}
          />
        </div>
        <div className="admin-card">
          <h2 className="text-dark-text-primary mb-4 text-xl font-semibold">Participant Demographics</h2>
          <DemographicsChartAdmin
            ageData={overviewStaticData.demographics.age}
            techBgData={overviewStaticData.demographics.technicalBackground}
          />
        </div>
      </section>
      {/* Recent Activity Section */}
      <section>
        <h2 className="text-dark-text-primary mb-5 text-xl font-bold sm:mb-6 sm:text-2xl">Recent Activity</h2>
        <div className="admin-card p-0">
          {' '}
          {/* Remove card padding if list items have their own */}
          {overviewStaticData.recentActivity.length > 0 ? (
            <ul className="activity-list">
              {overviewStaticData.recentActivity.map((activity) => {
                const IconComponent = activity.iconType;
                return (
                  <ActivityItem
                    key={activity.id}
                    icon={<IconComponent size={20} className={activity.iconColor} />}
                    text={activity.text}
                    time={activity.time}
                    actionLink={activity.actionLink}
                    actionText={activity.actionText}
                  />
                );
              })}
            </ul>
          ) : (
            <div className="text-dark-text-secondary p-6 text-center">No recent activity.</div>
          )}
        </div>
      </section>
    </>
  );
}
