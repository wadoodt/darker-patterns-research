import type { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { ApiError } from "./ApiError";
import type { ApiError as ApiErrorType } from "./types";

function createClientError(code: string, message?: string, details?: unknown): ApiErrorType {
  return {
    code,
    message: message || `An unexpected error occurred: ${code}`,
    ...(details ? { details } : {}),
  };
}

function createServerError(axiosError: AxiosError<ApiErrorType>): ApiErrorType {
  if (axiosError.response?.data?.code) {
    return axiosError.response.data;
  }

  if (axiosError.isAxiosError && !axiosError.response) {
    return createClientError(
      "NETWORK_ERROR",
      "Unable to connect to the server. Please check your network connection."
    );
  }

  return createClientError(
    axiosError.response?.statusText || "INTERNAL_SERVER_ERROR",
    `An unexpected server error occurred: ${axiosError.message}`,
    {
      statusCode: axiosError.response?.status,
      rawError: axiosError.message,
    }
  );
}

/**
 * A generic handler for making API requests.
 * This function centralizes error handling and response parsing.
 * @template T - The expected type of the data in the successful API response.
 * @param apiCall - A function that returns a promise from the `apiClient`.
 * @param requestConfig - Optional Axios request configuration.
 * @returns A promise that resolves with the unwrapped data on success, or rejects with an `ApiError` on failure.
 */
export const baseRequestHandler = async <T>(
  apiCall: (config?: AxiosRequestConfig) => Promise<AxiosResponse<T>>,
  requestConfig?: AxiosRequestConfig
): Promise<T> => {
  try {
    const response = await apiCall(requestConfig);

    // Check for a successful response (2xx status code)
    if (response.status >= 200 && response.status < 300) {
      return response.data;
    }

    if (response.status === 401) {
      throw new ApiError(createClientError("UNAUTHORIZED", "You are not authorized to access this resource."));
    }

    if (response.status >= 400 && response.status < 500) {
      throw new ApiError(createClientError("BAD_REQUEST", "The server returned a bad request."));
    }

    // Fallback for unexpected, non-2xx responses that don't throw an error
    console.error("API call failed with unhandled response: ", response);
    throw new ApiError(createClientError("UNKNOWN_RESPONSE", "The server returned an unexpected response."));

  } catch (error) {
    if (error instanceof ApiError) {
      throw error; // Re-throw if it's already our custom error
    }

    const axiosError = error as AxiosError<ApiErrorType>;
    const serverError = createServerError(axiosError);
    throw new ApiError(serverError);
  }
};
