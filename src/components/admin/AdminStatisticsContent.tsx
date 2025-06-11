// components/admin/AdminStatisticsContent.tsx
import React from 'react';
import AdminHeader from './AdminHeader';

const AdminStatisticsContent = () => {
  return (
    <>
      <AdminHeader
        title="Survey Statistics & Analytics"
        objective="View aggregated statistics from participant surveys, analyze trends, and export data."
      />
      <div className="admin-card">
        <p className="text-dark-text-secondary">(Detailed aggregated statistics, charts, data export will go here)</p>
      </div>
    </>
  );
};
export default AdminStatisticsContent;
