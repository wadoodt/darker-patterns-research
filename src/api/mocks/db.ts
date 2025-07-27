import { createTable } from "./lib/createTable";
import type { Company, AdminSettings } from "types";
import type { ContactSubmission } from "types/support";
import { mockCompanies } from "./_data/companies-data.ts";
import { mockUsers } from "./_data/user-data.ts";
import { mockAdminSettings } from "./_data/admin-settings-data";
import { mockPayments } from "./_data/payments-data";
import { mockKnowledgeBaseArticles, mockSupportTickets } from "./_data/support";
import type { KnowledgeBaseArticle } from "types/knowledge-base";
import { mockFaqs } from "./_data/faqs-data";

// The global mock database instance.
export const db = {
  users: createTable(mockUsers),
  companies: createTable<Company>(mockCompanies),
  adminSettings: createTable<AdminSettings>([mockAdminSettings]),
  payments: createTable(mockPayments),
  knowledgeBaseArticle: createTable<KnowledgeBaseArticle>(
    mockKnowledgeBaseArticles,
  ),
  contactSubmissions: createTable<ContactSubmission>([]),
  supportTickets: createTable(mockSupportTickets),
  faqs: createTable(mockFaqs),
};
