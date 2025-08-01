// src/api/mocks/_data/admin-settings-data.ts
import type { AdminSettings } from "types";

export const mockAdminSettings: AdminSettings = {
  id: "settings-001",
  siteName: "PenguinMails Admin",
  siteDescription: "Email management platform",
  contactEmail: "admin@penguinmails.com",
  supportEmail: "support@penguinmails.com",
  maxTeamMembers: 50,
  maxDomains: 100,
  maintenanceMode: false,
  featureFlags: {
    enableNewDashboard: true,
    enableBetaFeatures: false,
  },
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z",
};
