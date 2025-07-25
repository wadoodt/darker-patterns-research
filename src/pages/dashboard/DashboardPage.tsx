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
import SettingsPage from "@features/dashboard/pages/SettingsPage";
import SupportPage from "@features/dashboard/pages/SupportPage";
import UserTicketDetailPage from "@features/dashboard/pages/support/UserTicketDetailPage";
import CreateTeamMemberPage from "@features/dashboard/pages/team/new/CreateTeamMemberPage";

const DashboardPage: React.FC = () => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <div>Loading...</div>; // Or a proper loading spinner
  }

  if (!user) {
    window.location.href = "/login";
    return null;
  }

  const allNavigation = [...dashboardNavigation, ...adminNavigation];
  const filteredNav = allNavigation.filter((item) =>
    item.roles?.includes(user.role),
  );

  return (
    <DashboardLayout path={location.pathname} user={user}>
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
          path="/support"
          element={
            <ProtectedRoute roles={["user", "admin", "super-admin", "qa"]}>
              <SupportPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/support/tickets/:ticketId"
          element={
            <ProtectedRoute roles={["user", "admin", "super-admin", "qa"]}>
              <UserTicketDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute roles={["user", "admin", "super-admin", "qa"]}>
              <SettingsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/team/new"
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
