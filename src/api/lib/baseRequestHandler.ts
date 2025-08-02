/**
 * @file Provides a central, robust wrapper for all API client requests.
 */
import { AxiosError } from "axios";
import type { ApiResponse } from "types/api";

/**
 * Creates a client-side error response that matches the ApiResponse<T> interface.
 * @param code The error code
 * @param message Optional error message
 * @param details Optional error details
 */
function createClientErrorResponse<T>(
  code: string,
  message?: string,
  details?: unknown
): ApiResponse<T> {
  return {
    data: null,
    error: {
      code,
      message: message || code,
      ...(details ? { details } : {})
    },
    success: false
  };
}

/**
 * A centralized, base request handler that wraps all axios calls.
 * It standardizes error handling and provides a single point for logging.
 * It is the foundation for both `handleQuery` and `handleMutation`.
 *
 * @param apiCall A function that returns a promise from the `apiClient`.
 * @returns A promise that always resolves to an `ApiResponse` object.
 */

export const baseRequestHandler = async <T>(
  apiCall: () => Promise<{ data: ApiResponse<T>, status?: number, error?: string }>,
): Promise<ApiResponse<T>> => {
  try {
    const response = await apiCall();
    console.log('baseRequestHandler response', response);
    const apiResponse = response.data;

    if (response.status === 404) {
      return createClientErrorResponse<T>("NOT_FOUND");
    }

    if (!apiResponse && response.error) {
      // This can happen if a real API
      // returns a 200 OK with non-JSON or empty content.
      return createClientErrorResponse<T>(
        "INTERNAL_SERVER_ERROR",
        "The API response body was empty or invalid.",
        { detail: "The API response body was empty or invalid." }
      );
    }

    // Future enhancement: If a global notification library like `sonner` is added,
    // success toasts can be triggered here based on the response message.
    // Example: if (apiResponse.statusText) { toast.success(t(apiResponse.statusText)); }

    return apiResponse;
  } catch (error) {
    // Note: It's important to type the error as AxiosError<ApiResponse<unknown>>
    // to correctly access the nested error structure our backend provides.
    const axiosError = error as AxiosError<ApiResponse<unknown>>;

    let errorResponse: ApiResponse<T>;

    if (axiosError.response?.data?.error) {
      // Case 1: The server responded with a structured API error.
      errorResponse = { data: null, error: axiosError.response.data.error, success: false };
    } else {
      // Case 2: A network error or an unexpected server error occurred.
      // We create a standardized error response.
      errorResponse = createClientErrorResponse<T>("INTERNAL_SERVER_ERROR");
    }
    
    // Future enhancement: This is the ideal place to trigger global error toasts.
    // Example: toast.error(t(errorResponse.error.message));

    return errorResponse;
  }
};
