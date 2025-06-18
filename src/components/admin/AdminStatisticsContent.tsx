// components/admin/AdminStatisticsContent.tsx
import { getStatisticsData } from '@/lib/firestore/queries/admin';
import AdminHeader from './AdminHeader';
import DemographicsDisplayAdmin from './DemographicsDisplayAdmin';
import ResponseAnalyticsDisplay from './ResponseAnalyticsDisplay';
import ExportDpoDatasetButton from './ExportDpoDatasetButton';

const AdminStatisticsContent = async () => {
  const { demographicsSummary, overviewStats, responseAggregates } = await getStatisticsData();

  return (
    <>
      <AdminHeader
        title="Survey Statistics & Analytics"
        objective="View aggregated statistics from participant surveys, analyze trends, and export data."
      />
      <div className="space-y-8">
        <div>
          <h2 className="text-dark-text-primary mb-4 text-2xl font-bold">Data Export</h2>
          <ExportDpoDatasetButton />
        </div>
        <div>
          <h2 className="text-dark-text-primary mb-4 text-2xl font-bold">Response Analytics</h2>
          <ResponseAnalyticsDisplay overviewStats={overviewStats} responseAggregates={responseAggregates} />
        </div>
        <div>
          <h2 className="text-dark-text-primary mb-4 text-2xl font-bold">Participant Demographics</h2>
          <DemographicsDisplayAdmin summary={demographicsSummary} />
        </div>
      </div>
    </>
  );
};
export default AdminStatisticsContent;
