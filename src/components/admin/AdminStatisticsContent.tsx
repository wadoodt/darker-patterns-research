// components/admin/AdminStatisticsContent.tsx
import { getStatisticsData } from '@/lib/firestore/queries/admin';
import AdminHeader from './AdminHeader';
import DemographicsDisplayAdmin from './DemographicsDisplayAdmin';
import ResponseAnalyticsDisplay from './ResponseAnalyticsDisplay';
import ExportDpoDatasetButton from './ExportDpoDatasetButton';
import { ContentCard } from './ContentCard';

const AdminStatisticsContent = async () => {
  const { demographicsSummary, overviewStats, responseAggregates } = await getStatisticsData();

  return (
    <>
      <AdminHeader
        title="Survey Statistics & Analytics"
        objective="View aggregated statistics from participant surveys, analyze trends, and export data."
      />
      <div className="space-y-8">
        <ContentCard title="Data Export">
          <ExportDpoDatasetButton />
        </ContentCard>
        <ContentCard title="Response Analytics">
          <ResponseAnalyticsDisplay overviewStats={overviewStats} responseAggregates={responseAggregates} />
        </ContentCard>
        <ContentCard title="Participant Demographics">
          <DemographicsDisplayAdmin summary={demographicsSummary} />
        </ContentCard>
      </div>
    </>
  );
};
export default AdminStatisticsContent;
