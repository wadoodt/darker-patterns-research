import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { useAuth } from "@hooks/useAuth";
import DashboardLayout from "@layouts/DashboardLayout";
import ProtectedRoute from "@layouts/dashboard/ProtectedRoute";
import {
  dashboardNavigation,
  adminNavigation,
} from "@pages/dashboard/navigation";
import NotFoundPage from "@features/dashboard/pages/NotFoundPage";
import ProfilePage from "@features/dashboard/pages/ProfilePage";
import TicketDetailPage from "@features/admin-panel/pages/TicketDetailPage";
import UserTicketDetailPage from "@features/dashboard/pages/support/UserTicketDetailPage";
import CreateTeamMemberPage from "@features/dashboard/pages/team/new/CreateTeamMemberPage";

const DashboardPage: React.FC = () => {
  const { user, isLoading, isAuthenticated } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <div>Loading...</div>; // Or a proper loading spinner
  }

  if (!isLoading && !isAuthenticated) {
    window.location.href = "/login";
    return null;
  }

  const allNavigation = [...dashboardNavigation, ...adminNavigation];
  const filteredNav = allNavigation.filter((item) =>
    item.roles?.includes(user?.platformRole || ""),
  );

  return (
    <DashboardLayout path={location.pathname} user={user || undefined}>
      <Routes>
        {filteredNav.map((item) => (
          <Route
            key={item.name}
            path={item.path}
            element={
              <ProtectedRoute roles={item.roles}>
                <item.component />
              </ProtectedRoute>
            }
          />
        ))}
        <Route
          path="/dashboard/profile"
          element={
            <ProtectedRoute roles={["user", "admin", "super-admin", "qa"]}>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin-panel/tickets/:ticketId"
          element={
            <ProtectedRoute roles={["super-admin"]}>
              <TicketDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/support/tickets/:ticketId"
          element={
            <ProtectedRoute roles={["user", "admin", "super-admin", "qa"]}>
              <UserTicketDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/team/new"
          element={
            <ProtectedRoute roles={["admin", "super-admin"]}>
              <CreateTeamMemberPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </DashboardLayout>
  );
};

export default DashboardPage;
