import type { AxiosRequestConfig, AxiosResponse } from "axios";
import apiClient from "../client";
import { baseRequestHandler } from "./baseRequestHandler";

const post = <T, D = unknown>(
  url: string,
  data: D,
  config?: AxiosRequestConfig
): Promise<T> => {
  const apiCall = (conf?: AxiosRequestConfig): Promise<AxiosResponse<T>> =>
    apiClient.post<T>(url, data, conf);
  return baseRequestHandler<T>(apiCall, config);
};

const put = <T, D = unknown>(
  url: string,
  data: D,
  config?: AxiosRequestConfig
): Promise<T> => {
  const apiCall = (conf?: AxiosRequestConfig): Promise<AxiosResponse<T>> =>
    apiClient.put<T>(url, data, conf);
  return baseRequestHandler<T>(apiCall, config);
};

const patch = <T, D = unknown>(
  url: string,
  data: D,
  config?: AxiosRequestConfig
): Promise<T> => {
  const apiCall = (conf?: AxiosRequestConfig): Promise<AxiosResponse<T>> =>
    apiClient.patch<T>(url, data, conf);
  return baseRequestHandler<T>(apiCall, config);
};

const del = <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
  const apiCall = (conf?: AxiosRequestConfig): Promise<AxiosResponse<T>> =>
    apiClient.delete<T>(url, conf);
  return baseRequestHandler<T>(apiCall, config);
};

export const handleMutation = {
  post,
  put,
  patch,
  delete: del,
};
