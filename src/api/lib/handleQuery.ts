/**
 * @file Provides a specialized handler for query operations.
 */
import { baseRequestHandler } from "./baseRequestHandler";
import { ApiError } from "./ApiError";
import type { ApiResponse } from "types/api";

/**
 * A specialized request handler for QUERY operations.
 * It uses the `baseRequestHandler` and implements the standard
 * query pattern: throw an `ApiError` on failure, and return the
 * unwrapped data payload on success.
 *
 * @param apiCall A function that returns a promise from the `apiClient`.
 * @returns A promise that resolves to the unwrapped data of type T.
 */
export const handleQuery = async <T>(
  apiCall: () => Promise<{ data: ApiResponse<T>, status?: number, error?: string }>,
): Promise<T> => {
  const response = await baseRequestHandler(apiCall);

  if (response.error) {
    throw new ApiError(response.error);
  }

  // On success, the `data` property of ApiResponse is actually an ApiSuccess object.
  // We need to unwrap the core data from it.
  // const { message, ...data } = response.data;

  return response.data as T;
};
