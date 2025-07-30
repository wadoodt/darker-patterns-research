/**
 * @file Central configuration for the API layer.
 */

/**
 * Enables or disables verbose logging for all API requests and responses.
 * When true, the `handleRequest` utility will log the full response object
 * for both successful and failed requests to the console.
 *
 * @default false - Should be false in production environments.
 */
export const API_DEBUG_MODE = import.meta.env.VITE_API_DEBUG_MODE === 'true';
