import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { useAuth } from '@hooks/useAuth';
import DashboardLayout from '@layouts/DashboardLayout';
import ProtectedRoute from '@layouts/dashboard/ProtectedRoute';
import { dashboardNavigation, adminNavigation } from '@layouts/dashboard/navigation';
import NotFoundPage from '@features/dashboard/pages/NotFoundPage';

const DashboardPage: React.FC = () => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <div>Loading...</div>; // Or a proper loading spinner
  }

  if (!user) {
    window.location.href = '/login';
    return null;
  }

  const allNavigation = [...dashboardNavigation, ...adminNavigation];
  const filteredNav = allNavigation.filter(item => item.roles?.includes(user.role));

  return (
    <DashboardLayout path={location.pathname} user={user}>
      <Routes>
        {filteredNav.map((item) => (
          <Route
            key={item.name}
            path={item.path}
            element={<ProtectedRoute roles={item.roles}><item.component /></ProtectedRoute>}
          />
        ))}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </DashboardLayout>
  );
};

export default DashboardPage;
