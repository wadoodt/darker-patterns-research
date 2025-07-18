import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "@components/ProtectedRoute";
import ErrorBoundary from "@components/ErrorBoundary";
import DashboardLayout from "@layouts/DashboardLayout";

// Dashboard Pages
import DashboardPage from "@features/dashboard/pages/DashboardPage";
import SettingsPage from "@features/dashboard/pages/SettingsPage";
import ProfilePage from "@features/profile/pages/ProfilePage";
import TeamPage from "./pages/TeamPage";
import BillingPage from "./pages/BillingPage";
import InfraPage from "./pages/InfraPage";
import DomainsPage from "./pages/DomainsPage";
import NotFoundPage from "./pages/NotFoundPage";

// Admin Pages
import { AdminRoutes } from "@features/admin-panel/routes";

// Public Pages
import SignupIndex from "@pages/signup/index";

export const AppRoutes = () => (
  <Routes>
    {/* Public routes */}
    <Route path="/signup" element={<SignupIndex />} />

    {/* Authenticated routes with DashboardLayout */}
    <Route
      element={
        <ProtectedRoute>
          <ErrorBoundary>
            <DashboardLayout />
          </ErrorBoundary>
        </ProtectedRoute>
      }
    >
      {/* Dashboard routes */}
      <Route path="/dashboard">
        <Route index element={<DashboardPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="team" element={<TeamPage />} />
        <Route path="billing" element={<BillingPage />} />
        <Route path="infra" element={<InfraPage />} />
        <Route path="domains" element={<DomainsPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>

      {/* Admin routes */}
      <Route
        path="/admin-panel/*"
        element={
          <ProtectedRoute roles={["admin"]}>
            <AdminRoutes />
          </ProtectedRoute>
        }
      />
    </Route>

    {/* Redirect root to dashboard */}
    <Route path="/" element={<Navigate to="/dashboard" replace />} />
  </Routes>
);
