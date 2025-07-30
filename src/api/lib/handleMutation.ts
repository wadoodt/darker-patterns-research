/**
 * @file Provides a specialized handler for mutation operations.
 */
import { baseRequestHandler } from "./baseRequestHandler";
import type { ApiResponse } from "types/api";

/**
 * A specialized request handler for MUTATION operations.
 * It uses the `baseRequestHandler` and returns the full `ApiResponse` object.
 * This allows the calling code to implement custom logic for handling
 * both success and error cases, which is common for form submissions
 * or actions that require specific user feedback.
 *
 * @param apiCall A function that returns a promise from the `apiClient`.
 * @returns A promise that resolves to the `ApiResponse` object.
 */
export const handleMutation = async <T>(
  apiCall: () => Promise<{ data: ApiResponse<T>, status?: number, error?: string }>,
): Promise<ApiResponse<T>> => {
  return baseRequestHandler(apiCall);
};
