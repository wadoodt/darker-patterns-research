// src/api/mocks/companies-data.ts

import type { Company } from "types/api";

export const mockCompanies: Company[] = [
  { id: 'comp-001', name: 'Innovate Inc.', plan: 'Enterprise', stripeCustomerId: 'cus_enterprise_1', status: 'active' },
  { id: 'comp-002', name: 'DataDriven LLC', plan: 'Pro', stripeCustomerId: 'cus_pro_1', status: 'active' },
  { id: 'comp-003', name: 'Cloud Solutions Co.', plan: 'Enterprise', stripeCustomerId: 'cus_enterprise_2', status: 'past_due' },
  { id: 'comp-004', name: 'QuantumLeap Corp.', plan: 'Free', stripeCustomerId: 'cus_free_1', status: 'inactive' },
];
