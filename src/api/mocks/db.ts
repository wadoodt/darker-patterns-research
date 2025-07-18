import { createTable } from "./lib/createTable";
import type { Company, AdminSettings } from "types";
import { mockCompanies } from "./_data/companies-data.ts";
import { mockUsers } from "./_data/user-data.ts";
import { mockAdminSettings } from "./_data/admin-settings-data";
import { mockPayments } from "./_data/payments-data";

// The global mock database instance.
export const db = {
  users: createTable(mockUsers),
  companies: createTable<Company>(mockCompanies),
  adminSettings: createTable<AdminSettings>([mockAdminSettings]),
  payments: createTable(mockPayments),
};
