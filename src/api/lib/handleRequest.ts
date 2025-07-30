/**
 * @file Provides a central, robust wrapper for all API client requests.
 */
import { AxiosError } from "axios";
import { API_DEBUG_MODE } from "@api/config";
import { createErrorResponse } from "@api/response";
import type { ApiResponse } from "types/api";

/**
 * A centralized request handler that wraps all axios calls.
 * It standardizes error handling and provides a single point for logging.
 *
 * @param apiCall A function that returns a promise from the `apiClient`.
 * @returns A promise that always resolves to an `ApiResponse` object.
 */
export const handleRequest = async <T>(
  apiCall: () => Promise<{ data: ApiResponse<T> }>,
): Promise<ApiResponse<T>> => {
  try {
    const response = await apiCall();
    const apiResponse = response.data;

    if (API_DEBUG_MODE) {
      console.warn("[API Response]", apiResponse);
    }

    // Future enhancement: If a global notification library like `sonner` is added,
    // success toasts can be triggered here based on the response message.
    // Example: if (apiResponse.data?.message) { toast.success(t(apiResponse.data.message)); }

    return apiResponse;
  } catch (error) {
    // Note: It's important to type the error as AxiosError<ApiResponse<unknown>>
    // to correctly access the nested error structure our backend provides.
    const axiosError = error as AxiosError<ApiResponse<unknown>>;

    let errorResponse: ApiResponse<T>;

    if (axiosError.response?.data?.error) {
      // Case 1: The server responded with a structured API error.
      errorResponse = { data: null, error: axiosError.response.data.error };
    } else {
      // Case 2: A network error or an unexpected server error occurred.
      // We create a standardized error response.
      errorResponse = createErrorResponse<T>("INTERNAL_SERVER_ERROR");
    }

    if (API_DEBUG_MODE) {
      console.error("[API Error]", errorResponse);
    }
    
    // Future enhancement: This is the ideal place to trigger global error toasts.
    // Example: toast.error(t(errorResponse.error.message));

    return errorResponse;
  }
};
