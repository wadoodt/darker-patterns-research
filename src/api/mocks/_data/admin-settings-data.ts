// src/api/mocks/_data/admin-settings-data.ts
import type { AdminSettings } from 'types';

export const mockAdminSettings: AdminSettings = {
  id: 'settings-001',
  featureFlags: {
    enableNewDashboard: true,
    enableBetaFeatures: false,
  },
  blockedFeatures: ['legacy-reports'],
};
