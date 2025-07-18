import { Routes, Route } from "react-router-dom";

import AdminPanelPage from "./pages/AdminPanelPage";
import AdminPanelSettingsPage from "./pages/SettingsPage";
import AdminPanelUsersPage from "./pages/UsersPage";
import AdminPanelCompaniesPage from "./pages/CompaniesPage";
import AdminPanelInfraPage from "./pages/InfraPage";
import NotFoundPage from "./pages/NotFoundPage";

export const AdminRoutes = () => (
  <Routes>
    <Route index element={<AdminPanelPage />} />
    <Route path="settings" element={<AdminPanelSettingsPage />} />
    <Route path="users" element={<AdminPanelUsersPage />} />
    <Route path="companies" element={<AdminPanelCompaniesPage />} />
    <Route path="infra" element={<AdminPanelInfraPage />} />
    <Route path="*" element={<NotFoundPage />} />
  </Routes>
);
