import { createTable } from "./drizzle/createMockTable";
import type { Company, AdminSettings } from "types";
import type { ContactSubmission } from "types/support";
import { mockCompanies } from "./data/companies";
import { mockUsers } from "./data/users";
import { mockAdminSettings } from "./data/admin-settings";
import { mockPayments } from "./data/payments";
import { mockKnowledgeBaseArticles, mockSupportTickets } from "./data/support";
import type { KnowledgeBaseArticle } from "types/knowledge-base";
import { mockFaqs } from "./data/faqs";
import { mockNotifications } from "./data/notifications";

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
  notifications: createTable(mockNotifications),
};
