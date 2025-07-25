// src/api/mocks/companies-data.ts

import type { Company } from "types/api";

export const mockCompanies: Company[] = [
  {
    id: "comp-001",
    name: "Innovate Inc.",
    plan: "Enterprise",
    status: "active",
    stripeCustomerId: "cus_enterprise_1",
    officialEmail: "contact@innovate.com",
    taxId: "IE1234567T",
    taxIdCountry: "IE"
  },
  {
    id: "comp-002",
    name: "DataDriven LLC",
    plan: "Pro",
    status: "active",
    stripeCustomerId: "cus_pro_1",
    officialEmail: "billing@datadriven.com"
  },
  {
    id: "comp-003",
    name: "Cloud Solutions Co.",
    plan: "Enterprise",
    status: "past_due",
    stripeCustomerId: "cus_enterprise_2",
    officialEmail: "accounts@cloudsolutions.com",
    taxId: "DE811234567",
    taxIdCountry: "DE"
  },
  {
    id: "comp-004",
    name: "QuantumLeap Corp.",
    plan: "Free",
    status: "inactive",
    stripeCustomerId: "cus_free_1"
  },
  // create a company with id comp-123 active
  {
    id: "comp-123",
    name: "Cloud Solutions Co.",
    plan: "Enterprise",
    status: "active",
    stripeCustomerId: "cus_enterprise_2",
    officialEmail: "accounts@cloudsolutions.com",
    taxId: "DE811234567",
    taxIdCountry: "DE"
  },
];
