import type { Metadata } from 'next';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { CheckCircle, Clock, PieChart, Users } from 'lucide-react';

import AdminHeader from '@/components/admin/AdminHeader';
import DemographicsCharts from '@/components/admin/charts/DemographicsCharts';
import ProjectProgressChart from '@/components/admin/charts/ProjectProgressChart';
import StatCardAdmin from '@/components/admin/StatCardAdmin';
import { Card, CardContent } from '@/components/ui/card';
import { getDashboardData } from '@/lib/firestore/queries/dashboard';

export const metadata: Metadata = { title: 'Project Overview - DPO Admin' };

const AdminDashboardPage = async () => {
  const dashboardData = await getDashboardData();

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <AdminHeader title="Project Overview" />

      {/* Stats Cards */}
      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCardAdmin title="Total Entries" value={dashboardData.totalEntries} icon={<PieChart />} />
        <StatCardAdmin title="Entries Completed" value={dashboardData.entriesCompleted} icon={<CheckCircle />} />
        <StatCardAdmin title="Avg. Time per Entry" value={dashboardData.avgTimePerEntry} icon={<Clock />} />
        <StatCardAdmin title="Active Participants" value={dashboardData.activeParticipants} icon={<Users />} />
      </section>

      {/* Charts Section */}
      <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardContent className="p-4">
            <h2 className="mb-4 text-xl font-semibold">Project Progress Overview</h2>
            <ProjectProgressChart data={dashboardData.projectProgress} />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <h2 className="mb-4 text-xl font-semibold">Participant Demographics</h2>
            <DemographicsCharts data={dashboardData.demographics} />
          </CardContent>
        </Card>
      </section>

      {/* Recent Activity Section */}
      <section>
        <h2 className="mb-4 text-xl font-semibold">Recent Activity</h2>
        <div className="admin-card p-0">
          {dashboardData.recentActivity.length > 0 ? (
            <ul className="activity-list">
              {dashboardData.recentActivity.map((item) => {
                const content = (
                  <div className="activity-item-content">
                    <div className="flex-1 space-y-1">
                      <p className="activity-item-text-primary">{item.description}</p>
                      <p className="activity-item-text-secondary">
                        {formatDistanceToNow(item.timestamp, { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                );

                return (
                  <li key={item.id}>
                    {item.href ? (
                      <Link href={item.href} className="activity-item block transition-colors hover:bg-white/5">
                        {content}
                      </Link>
                    ) : (
                      <div className="activity-item">{content}</div>
                    )}
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="text-muted-foreground p-6 text-center text-sm">No recent activity to display.</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default AdminDashboardPage;
