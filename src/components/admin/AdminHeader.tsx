// components/admin/AdminHeader.tsx
import type React from 'react';
import type { AdminHeaderProps } from './AdminHeader.types';

const AdminHeader: React.FC<AdminHeaderProps> = ({ title, objective, className = '' }) => {
  return (
    <header className={`admin-main-header-container ${className}`}>
      {/* 
        Optional: Could add breadcrumbs here in the future if navigation gets deeper.
        For now, just title and objective as per the provided design.
      */}
      <div>
        {' '}
        {/* This div was in your HTML example, useful if adding breadcrumbs or other elements */}
        <h1 className="admin-main-header-title">{title}</h1>
        {objective && <p className="admin-main-header-objective">{objective}</p>}
      </div>
      {/* Optional: Could add action buttons here specific to the page (e.g., "Add New Entry") */}
    </header>
  );
};

export default AdminHeader;
