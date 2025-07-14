import * as authHandlers from './handlers/auth';

// Maps a route key (e.g., 'POST /api/auth/login') to a handler function.
const routes: Record<string, (request: Request) => Promise<Response>> = {
  'POST /auth/login': authHandlers.login,
  'GET /auth/me': authHandlers.me,
  'POST /auth/logout': authHandlers.logout,
  // Add other routes here, e.g.:
  // 'GET /api/users': userHandlers.getUsers,
};

/**
 * Resolves an incoming request to the appropriate mock API handler.
 * @param request The incoming Request object from the intercepted call.
 * @returns A promise that resolves to a Response object.
 */
export const resolve = (request: Request): Promise<Response> => {
  const url = new URL(request.url);
  const routeKey = `${request.method.toUpperCase()} ${url.pathname}`;

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
