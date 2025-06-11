// components/admin/AdminOverviewContent.tsx
import React from 'react';
import AdminHeader from './AdminHeader';

const AdminOverviewContent = () => {
  return (
    <>
      <AdminHeader
        title="Dark Pattern Validator - Project Overview"
        objective="Dashboard providing a summary of DPO dataset validation progress, key statistics, and recent activity."
      />
      <div className="space-y-6">
        <p className="text-dark-text-secondary">(Stats cards, charts, and activity feed will go here)</p>
        {/* Example of how cards might look later */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="admin-card">
            <h3 className="text-dark-text-primary mb-2 text-lg font-semibold">Total Entries</h3>
            <p className="text-brand-purple-400 text-3xl font-bold">1,234</p>
            <p className="text-dark-text-tertiary mt-1 text-xs">+20 from yesterday</p>
          </div>
          <div className="admin-card">
            <h3 className="text-dark-text-primary mb-2 text-lg font-semibold">Patterns Identified</h3>
            <p className="text-accent-cyan text-3xl font-bold">78</p>
            <p className="text-dark-text-tertiary mt-1 text-xs">In 12 categories</p>
          </div>
          <div className="admin-card">
            <h3 className="text-dark-text-primary mb-2 text-lg font-semibold">Active Researchers</h3>
            <p className="text-accent-pink text-3xl font-bold">15</p>
            <p className="text-dark-text-tertiary mt-1 text-xs">Online now: 3</p>
          </div>
        </div>
      </div>
    </>
  );
};
export default AdminOverviewContent;
