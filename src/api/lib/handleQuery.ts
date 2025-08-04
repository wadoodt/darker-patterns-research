import type { AxiosRequestConfig, AxiosResponse } from "axios";
import apiClient from "../client";
import { baseRequestHandler } from "./baseRequestHandler";

/**
 * A wrapper for making GET requests. It uses the `baseRequestHandler` to
 * ensure consistent error handling and response unwrapping.
 *
 * @template T - The expected data type of the successful response.
 * @param url - The URL endpoint for the GET request.
 * @param config - Optional Axios request configuration.
 * @returns A promise that resolves to the unwrapped data or rejects with an ApiError.
 */
export const handleQuery = <T>(
  url: string,
  config?: AxiosRequestConfig
): Promise<T> => {
  const apiCall = (conf?: AxiosRequestConfig): Promise<AxiosResponse<T>> =>
    apiClient.get<T>(url, conf);
  return baseRequestHandler<T>(apiCall, config);
};
