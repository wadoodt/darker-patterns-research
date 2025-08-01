import { createTable } from "./drizzle/createMockTable";
import type { Company, AdminSettings } from "types";
import type { ContactSubmission } from "types/support";
import { mockCompanies } from "./data/companies";
import { mockUsers } from "./data/users";
import { mockAdminSettings } from "./data/admin-settings";
import { mockPayments } from "./data/payments";
import { mockKnowledgeBaseArticles, mockSupportTickets } from "./data/support";
import type { KnowledgeBaseArticle } from "@api/domains/knowledge-base/types";
import { mockFaqs } from "./data/faqs";
import { mockNotifications } from "./data/notifications";
import type { User } from "@api/domains/users/types";
import type { Payment } from "@api/domains/payments/types";
import type { SupportTicket } from "@api/domains/support/types";
import type { FaqItem } from "@api/domains/faq/types";
import type { Notification } from "@api/domains/notifications/types";

// The global mock database instance.
export const db = {
  users: createTable<User>(mockUsers),
  companies: createTable<Company>(mockCompanies),
  adminSettings: createTable<AdminSettings>([mockAdminSettings]),
  payments: createTable<Payment>(mockPayments),
  knowledgeBaseArticle: createTable<KnowledgeBaseArticle>(
    mockKnowledgeBaseArticles
  ),
  contactSubmissions: createTable<ContactSubmission>([]),
  supportTickets: createTable<SupportTicket>(mockSupportTickets),
  faqs: createTable<FaqItem>(mockFaqs),
  notifications: createTable<Notification>(mockNotifications),
};
