/**
 * @file Provides a specialized handler for mutation operations.
 */
import { baseRequestHandler } from "./baseRequestHandler";
import { ApiError } from "./ApiError";
import type { ApiResponse } from "types/api";

/**
 * A specialized request handler for MUTATION operations.
 * It uses the `baseRequestHandler` and extracts the data from the ApiResponse.
 * This provides a consistent pattern where mutations return the actual data
 * rather than the wrapper, making it easier to use in components.
 *
 * @param apiCall A function that returns a promise from the `apiClient`.
 * @returns A promise that resolves to the unwrapped data of type T.
 */
export const handleMutation = async <T>(
  apiCall: () => Promise<{
    data: ApiResponse<T>;
    error?: string;
  }>
): Promise<T> => {
  try {
    const response = await baseRequestHandler(apiCall);

    console.log("handleMutation response", response);

    if (response.error) {
      throw new ApiError({
        message:
          response.error?.message || "error.general.internal_server_error",
      });
    }

    return response as T;
  } catch (error) {
    // Optionally, you could add more sophisticated error handling/logging here
    throw error instanceof ApiError
      ? error
      : new ApiError({ message: "error.general.internal_server_error" });
  }
};
