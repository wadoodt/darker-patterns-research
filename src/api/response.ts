/**
 * @file Defines the API response constants and utility functions.
 * This file should be used for runtime logic, not for type definitions.
 */

import { RESPONSE_CODES, ERROR_CODES } from "./codes";

/**
 * Creates a standardized success Response for successful API calls.
 * @param code The success code from RESPONSE_CODES.
 * @param domain The domain key for the response (e.g., "users", "admin").
 * @param data The payload to be returned.
 */
export function createSuccessResponse(
  code: keyof typeof RESPONSE_CODES,
  domain: string,
  data: unknown
): Response {
  const { status, message } = RESPONSE_CODES[code];
  return new Response(
    JSON.stringify({ [domain]: data }),
    { status, statusText: message }
  );
}

/**
 * Creates a standardized paginated Response for successful API calls.
 * @param code The success code from RESPONSE_CODES.
 * @param domain The domain key for the response (e.g., "users", "admin").
 * @param data The array of items to be returned.
 * @param page The current page number.
 * @param totalPages The total number of pages.
 * @param totalItems The total number of items.
 */
export function createPaginatedResponse(
  code: keyof typeof RESPONSE_CODES,
  domain: string,
  data: unknown[],
  page: number,
  totalPages: number,
  totalItems: number
): Response {
  const { status, message } = RESPONSE_CODES[code];
  return new Response(
    JSON.stringify({
      [domain]: data,
      currentPage: page,
      totalPages,
      total: totalItems,
    }),
    { status, statusText: message }
  );
}

/**
 * Creates a standardized error Response for failed API calls.
 * @param code The error code from ERROR_CODES.
 * @param message Optional override for the error message.
 * @param details Optional details for the error.
 */
export function createErrorResponse(
  code: keyof typeof ERROR_CODES,
  message?: string,
  details?: unknown
): Response {
  const { status, message: defaultMessage } = ERROR_CODES[code];
  return new Response(
    JSON.stringify({
      error: {
        message: defaultMessage || message,
        ...(details ? { details } : {}),
      },
    }),
    { status, statusText: message || defaultMessage }
  );
}
