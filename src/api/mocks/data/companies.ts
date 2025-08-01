// src/api/mocks/companies-data.ts

import type { Company } from "types";

export const mockCompanies: Company[] = [
  {
    id: "comp-001",
    name: "Innovate Inc.",
    domain: "innovate.com",
    plan: "Enterprise",
    status: "active",
    stripeCustomerId: "cus_enterprise_1",
    officialEmail: "contact@innovate.com",
    taxId: "IE1234567T",
    taxIdCountry: "IE",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  },
  {
    id: "comp-002",
    name: "DataDriven LLC",
    domain: "datadriven.com",
    plan: "Pro",
    status: "active",
    stripeCustomerId: "cus_pro_1",
    officialEmail: "billing@datadriven.com",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  },
  {
    id: "comp-003",
    name: "Cloud Solutions Co.",
    domain: "cloudsolutions.com",
    plan: "Enterprise",
    status: "past_due",
    stripeCustomerId: "cus_enterprise_2",
    officialEmail: "accounts@cloudsolutions.com",
    taxId: "DE811234567",
    taxIdCountry: "DE",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  },
  {
    id: "comp-004",
    name: "QuantumLeap Corp.",
    domain: "quantumleap.com",
    plan: "Free",
    status: "inactive",
    stripeCustomerId: "cus_free_1",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  },
  // create a company with id comp-123 active
  {
    id: "comp-123",
    name: "Cloud Solutions Co.",
    domain: "cloudsolutions.com",
    plan: "Enterprise",
    status: "active",
    stripeCustomerId: "cus_enterprise_2",
    officialEmail: "accounts@cloudsolutions.com",
    taxId: "DE811234567",
    taxIdCountry: "DE",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  },
];
