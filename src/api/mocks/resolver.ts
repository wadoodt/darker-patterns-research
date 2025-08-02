import * as authHandlers from "./handlers/auth";
import * as userHandlers from "./handlers/users";
import * as companyHandlers from "./handlers/companies";
import * as adminHandlers from "./handlers/admin";
import * as paymentsHandlers from "./handlers/payments";
import * as supportTicketsHandlers from "./handlers/support-tickets";
import * as knowledgeBaseHandlers from "./handlers/knowledge-base";
import * as teamHandlers from "./handlers/team";
import * as notificationsHandlers from "./handlers/notifications";
import * as faqHandlers from "./handlers/faq";

// Maps a route key (e.g., 'POST /api/auth/login') to a handler function.
const routes: Array<[string, RegExp, unknown]> = [
  // Auth
  ["POST /api/auth/login", /^\/api\/auth\/login$/, authHandlers.login],
  [
    "POST /api/auth/refresh-token",
    /^\/api\/auth\/refresh-token$/,
    authHandlers.refreshToken,
  ],
  ["POST /api/auth/logout", /^\/api\/auth\/logout$/, authHandlers.logout],
  ["POST /api/auth/signup", /^\/api\/auth\/signup$/, authHandlers.signup],

  // Notifications
  [
    "GET /api/notifications",
    /^\/api\/notifications$/,
    notificationsHandlers.getNotifications,
  ],
  [
    "PATCH /api/notifications/:id/read",
    /^\/api\/notifications\/([^/]+)\/read$/,
    notificationsHandlers.markAsRead,
  ],
  [
    "PATCH /api/notifications/read-all",
    /^\/api\/notifications\/read-all$/,
    notificationsHandlers.markAllAsRead,
  ],

  // App Data
  ["GET /api/companies", /^\/api\/companies$/, companyHandlers.getCompanies],

  // User
  ["GET /api/users/me", /^\/api\/users\/me$/, userHandlers.getUserMe],
  ["PATCH /api/users/me", /^\/api\/users\/me$/, userHandlers.updateUserMe],

  // Admin
  ["GET /api/admin/users", /^\/api\/admin\/users$/, adminHandlers.getUsers],
  [
    "PATCH /api/admin/users/:userId",
    /^\/api\/admin\/users\/([^/]+)$/,
    adminHandlers.updateUser,
  ],
  [
    "GET /api/admin/tickets",
    /^\/api\/admin\/tickets$/,
    adminHandlers.getSupportTickets,
  ],
  [
    "PATCH /api/admin/tickets/:ticketId",
    /^\/api\/admin\/tickets\/([^/]+)$/,
    adminHandlers.updateTicketStatus,
  ],

  // Payments
  ["POST /api/payments", /^\/api\/payments$/, paymentsHandlers.createPayment],

  // Support
  [
    "POST /api/support/contact",
    /^\/api\/support\/contact$/,
    supportTicketsHandlers.createContactSubmission,
  ],
  [
    "GET /api/support/tickets",
    /^\/api\/support\/tickets$/,
    supportTicketsHandlers.getMyTickets,
  ],
  [
    "GET /api/support/tickets/:ticketId",
    /^\/api\/support\/tickets\/([^/]+)$/,
    supportTicketsHandlers.getTicketById,
  ],
  [
    "POST /api/support/tickets/:ticketId/replies",
    /^\/api\/support\/tickets\/([^/]+)\/replies$/,
    supportTicketsHandlers.createTicketReply,
  ],

  // Knowledge Base Articles
  ["GET /api/knowledge-base/articles", /^\/api\/knowledge-base\/articles$/, knowledgeBaseHandlers.getArticles],
  [
    "POST /api/knowledge-base/articles",
    /^\/api\/knowledge-base\/articles$/,
    knowledgeBaseHandlers.createArticle,
  ],
  [
    "PUT /api/knowledge-base/articles/:id",
    /^\/api\/knowledge-base\/articles\/([^/]+)$/,
    knowledgeBaseHandlers.updateArticle,
  ],
  [
    "DELETE /api/knowledge-base/articles/:id",
    /^\/api\/articles\/([^/]+)$/,
    knowledgeBaseHandlers.deleteArticle,
  ],

  // FAQs
  ["GET /api/faqs", /^\/api\/faqs$/, faqHandlers.getFaqs],
  ["POST /api/faqs", /^\/api\/faqs$/, faqHandlers.createFaq],
  ["PUT /api/faqs/:id", /^\/api\/faqs\/([^/]+)$/, faqHandlers.updateFaq],
  ["DELETE /api/faqs/:id", /^\/api\/faqs\/([^/]+)$/, faqHandlers.deleteFaq],

  // Team
  ["POST /api/team", /^\/api\/team$/, teamHandlers.createTeamMember],
  ["GET /api/team", /^\/api\/team$/, teamHandlers.getTeamMembers],
  [
    "PATCH /api/team/:id",
    /^\/api\/team\/([^/]+)$/,
    teamHandlers.updateTeamMember,
  ],
  [
    "DELETE /api/team/:id",
    /^\/api\/team\/([^/]+)$/,
    teamHandlers.deleteTeamMember,
  ],
  [
    "PATCH /api/team/:id/platform-role",
    /^\/api\/team\/([^/]+)\/platform-role$/,
    teamHandlers.updatePlatformRole,
  ],
];

/**
 * Resolves an incoming request to the appropriate mock API handler.
 * @param request The incoming request object.
 * @returns A promise that resolves to a Response object.
 */
export const resolve = async (request: Request): Promise<Response> => {
  const { method, url } = request;
  const { pathname } = new URL(url);

  for (const [route, pattern, handler] of routes) {
    const [reqMethod] = route.split(" ");
    if (method.toUpperCase() !== reqMethod) continue;

    const match = pathname.match(pattern);
    if (match) {
      const params: Record<string, string> = {};
      const paramNames = (route.match(/:(\w+)/g) || []).map((name) =>
        name.substring(1),
      );
      if (paramNames.length > 0) {
        paramNames.forEach((name, index) => {
          params[name] = match[index + 1];
        });
      }
      if (typeof handler === "function") {
        return handler(request, params);
      } else {
        return new Response("Mock handler is not a function", { status: 500 });
      }
    }
  }

  // Legacy dynamic routes - can be refactored into the main routes array later
  if (
    request.method.toUpperCase() === "GET" &&
    pathname.startsWith("/api/payments/")
  ) {
    const paymentId = pathname.split("/").pop();
    if (paymentId) {
      return paymentsHandlers.getPayment(request, paymentId);
    }
  }

  return new Response(`Mock handler not found for ${method} ${pathname}`, {
    status: 404,
  });
};
