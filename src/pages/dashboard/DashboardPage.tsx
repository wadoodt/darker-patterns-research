import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "@components/ProtectedRoute";
import DashboardLayout from "@layouts/DashboardLayout";

// Dashboard Pages
import DashboardHomePage from "@features/dashboard/pages/DashboardHomePage";
import ProfilePage from "@features/profile/pages/ProfilePage";
import TeamPage from "@features/dashboard/pages/TeamPage";
import BillingPage from "@features/dashboard/pages/BillingPage";
import InfraPage from "@features/dashboard/pages/InfraPage";
import DomainsPage from "@features/dashboard/pages/DomainsPage";
import SettingsPage from "@features/dashboard/pages/SettingsPage";
import NotFoundPage from "@features/dashboard/pages/NotFoundPage";

// Admin Pages
import AdminPanelPage from "@features/admin-panel/pages/AdminPanelPage";
import AdminPanelSettingsPage from "@features/admin-panel/pages/SettingsPage";
import AdminPanelUsersPage from "@features/admin-panel/pages/UsersPage";
import AdminPanelCompaniesPage from "@features/admin-panel/pages/CompaniesPage";
import AdminPanelInfraPage from "@features/admin-panel/pages/InfraPage";

const DashboardPage = () => (
  <Routes>
    {/* Dashboard routes */}
    <Route path="/dashboard" element={<DashboardLayout />}>
      <Route
        element={<ProtectedRoute roles={["admin", "super-admin", "qa"]} />}
      >
        <Route index element={<DashboardHomePage />} />
        <Route path="team" element={<TeamPage />} />
        <Route path="billing" element={<BillingPage />} />
        <Route path="infra" element={<InfraPage />} />
        <Route path="domains" element={<DomainsPage />} />
      </Route>
      <Route
        element={
          <ProtectedRoute roles={["user", "admin", "super-admin", "qa"]} />
        }
      >
        <Route path="settings" element={<SettingsPage />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Route>

    {/* Super Admin routes */}
    <Route path="/admin-panel" element={<DashboardLayout />}>
      <Route element={<ProtectedRoute roles={["super-admin", "qa"]} />}>
        <Route index element={<AdminPanelPage />} />
        <Route path="settings" element={<AdminPanelSettingsPage />} />
        <Route path="users" element={<AdminPanelUsersPage />} />
        <Route path="companies" element={<AdminPanelCompaniesPage />} />
        <Route path="infra" element={<AdminPanelInfraPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Route>

    {/* Redirect root to dashboard */}
    <Route path="/" element={<Navigate to="/dashboard" replace />} />
  </Routes>
);

export default DashboardPage;
