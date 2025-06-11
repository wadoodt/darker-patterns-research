// components/admin/AdminSettingsContent.tsx
import React from 'react';
import AdminHeader from './AdminHeader';

const AdminSettingsContent = () => {
  return (
    <>
      <AdminHeader
        title="Project Settings"
        objective="Configure survey parameters, manage project-wide settings, and view application status."
      />
      <div className="admin-card">
        <p className="text-dark-text-secondary">
          (Controls for survey status, recent updates, target reviews, API keys, etc. will go here)
        </p>
      </div>
    </>
  );
};
export default AdminSettingsContent;
