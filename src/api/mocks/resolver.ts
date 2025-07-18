import * as authHandlers from './handlers/auth';
import * as companyHandlers from './handlers/companies-handler.ts';
import * as userHandlers from './handlers/user-handler';
import * as adminHandlers from './handlers/admin-handler';
import * as paymentsHandlers from './handlers/payments-handler';

// Maps a route key (e.g., 'POST /api/auth/login') to a handler function.
const routes: Record<string, (request: Request, ...args: unknown[]) => Promise<Response>> = {
  // Auth
  'POST /api/auth/login': authHandlers.login,
  'POST /api/auth/logout': authHandlers.logout,
  'POST /api/auth/signup': authHandlers.signup,

  // App Data
  'GET /api/companies': companyHandlers.getCompanies,

  // User
  'GET /api/users/me': userHandlers.getUserMe,
  'PATCH /api/users/me': userHandlers.updateUserMe,

  // Admin
  'GET /api/admin/users': adminHandlers.getUsers,
  'PATCH /api/admin/users/:userId': adminHandlers.updateUser,

  // Payments
  'POST /api/payments': paymentsHandlers.createPayment,
  // 'GET /api/payments/:id' handled dynamically below
};

/**
 * Resolves an incoming request to the appropriate mock API handler.
 * @param request The incoming Request object from the intercepted call.
 * @returns A promise that resolves to a Response object.
 */
export const resolve = (request: Request): Promise<Response> => {
  const url = new URL(request.url);
  const routeKey = `${request.method.toUpperCase()} ${url.pathname}`;

  // Dynamic route for GET /api/payments/:id
  if (request.method.toUpperCase() === 'GET' && url.pathname.startsWith('/api/payments/')) {
    const id = url.pathname.split('/').pop();
    if (id) {
      return paymentsHandlers.getPayment(request, id);
    }
  }

  const handler = routes[routeKey];

  if (handler) {
    return handler(request);
  }

  // If no handler is found, return a 404 response.
  return Promise.resolve(
    new Response(JSON.stringify({ message: `Mock handler for ${routeKey} not found` }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    })
  );
};
