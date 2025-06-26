// components/admin/AdminStatisticsContent.tsx
import { getStatisticsData } from '@/lib/firestore/queries/admin';
import AdminHeader from './AdminHeader';
import DemographicsDisplayAdmin from './DemographicsDisplayAdmin';
import ResponseAnalyticsDisplay from './ResponseAnalyticsDisplay';
import ExportDpoDatasetButton from './ExportDpoDatasetButton';
import { ContentCard } from './ContentCard';
import ProjectProgressChart from '@/components/admin/charts/ProjectProgressChart';
import { getDashboardData } from '@/lib/firestore/queries/dashboard';

const AdminStatisticsContent = async () => {
  const { demographicsSummary, overviewStats, responseAggregates } = await getStatisticsData();
  const { projectProgress } = await getDashboardData();

  return (
    <>
      <AdminHeader
        title="Survey Statistics & Analytics"
        objective="View aggregated statistics from participant surveys, analyze trends, and export data."
      />
      <div className="space-y-8">
        <ContentCard title="Project Progress Overview">
          <ProjectProgressChart data={projectProgress} />
        </ContentCard>
        <ContentCard title="Data Export">
          <ExportDpoDatasetButton />
        </ContentCard>
        <ContentCard title="Response Analytics">
          <ResponseAnalyticsDisplay overviewStats={overviewStats} responseAggregates={responseAggregates} />
        </ContentCard>
        <ContentCard title="Participant Demographics" id="demographics">
          <DemographicsDisplayAdmin summary={demographicsSummary} />
        </ContentCard>
      </div>
    </>
  );
};
export default AdminStatisticsContent;
