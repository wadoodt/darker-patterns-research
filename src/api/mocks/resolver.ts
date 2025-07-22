import * as authHandlers from "./handlers/auth";
import * as userHandlers from "./handlers/user-handler";
import * as companyHandlers from "./handlers/companies-handler";
import * as adminHandlers from "./handlers/admin-handler";
import * as paymentsHandlers from "./handlers/payments-handler";
import * as supportHandlers from "./handlers/support";
import { getArticles, createArticle, updateArticle, deleteArticle } from './handlers/admin-articles-handler';

// Maps a route key (e.g., 'POST /api/auth/login') to a handler function.
const routes: Array<[string, RegExp, unknown]> = [
    // Auth
    ["POST /api/auth/login", /^\/api\/auth\/login$/, authHandlers.login],
    ["POST /api/auth/logout", /^\/api\/auth\/logout$/, authHandlers.logout],
    ["POST /api/auth/signup", /^\/api\/auth\/signup$/, authHandlers.signup],

    // App Data
    ["GET /api/companies", /^\/api\/companies$/, companyHandlers.getCompanies],

    // User
    ["GET /api/users/me", /^\/api\/users\/me$/, userHandlers.getUserMe],
    ["PATCH /api/users/me", /^\/api\/users\/me$/, userHandlers.updateUserMe],

    // Admin
    ["GET /api/admin/users", /^\/api\/admin\/users$/, adminHandlers.getUsers],
    ["PATCH /api/admin/users/:userId", /^\/api\/admin\/users\/([^/]+)$/, adminHandlers.updateUser],
    ["GET /api/admin/tickets", /^\/api\/admin\/tickets$/, adminHandlers.getSupportTickets],
    ["PATCH /api/admin/tickets/:ticketId", /^\/api\/admin\/tickets\/([^/]+)$/, adminHandlers.updateTicketStatus],

    // Payments
    ["POST /api/payments", /^\/api\/payments$/, paymentsHandlers.createPayment],

    // Support
    ["GET /api/support/articles", /^\/api\/support\/articles$/, supportHandlers.getSupportArticles],
    ["POST /api/support/contact", /^\/api\/support\/contact$/, supportHandlers.createContactSubmission],
    ["GET /api/support/my-tickets", /^\/api\/support\/my-tickets$/, supportHandlers.getMyTickets],
    ["GET /api/support/tickets/:ticketId", /^\/api\/support\/tickets\/([^/]+)$/, supportHandlers.getTicketById],
    ["POST /api/support/tickets/:ticketId/reply", /^\/api\/support\/tickets\/([^/]+)\/reply$/, supportHandlers.createTicketReply],

    // Admin - Articles
    ["GET /api/admin/articles", /^\/api\/admin\/articles$/, getArticles],
    ["POST /api/admin/articles", /^\/api\/admin\/articles$/, createArticle],
    ["PUT /api/admin/articles/:id", /^\/api\/admin\/articles\/([^/]+)$/, updateArticle],
    ["DELETE /api/admin/articles/:id", /^\/api\/admin\/articles\/([^/]+)$/, deleteArticle],
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
        const [reqMethod] = route.split(' ');
        if (method.toUpperCase() !== reqMethod) continue;

        const match = pathname.match(pattern);
        if (match) {
            const params: Record<string, string> = {};
            const paramNames = (route.match(/:(\w+)/g) || []).map(name => name.substring(1));
            if (paramNames.length > 0) {
                paramNames.forEach((name, index) => {
                    params[name] = match[index + 1];
                });
            }
            if (typeof handler === 'function') {
                return handler(request, params);
            } else {
                return new Response('Mock handler is not a function', { status: 500 });
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
