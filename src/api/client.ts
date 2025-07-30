/// <reference types="vite/client" />

import axios from "axios";
import { API_DEBUG_MODE } from "./config";

const apiClient = axios.create({
  baseURL: "/api",
});

import { resolve } from "./mocks/resolver";

apiClient.interceptors.request.use(
  async (config) => {
    // 1. Add the authentication token to the headers.
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (API_DEBUG_MODE) {
      console.log(`[API Request] > ${config.method?.toUpperCase()} ${config.url}`, {
        payload: config.data,
      });
    }

    // 2. If mocks are enabled, intercept the request and use the mock resolver.
    if (import.meta.env.VITE_USE_MOCKS === "true") {
      // The resolver needs a standard Request object. We build one from the axios config.
      // A dummy base is required for the URL constructor.
      const fullUrl = `${config.baseURL || ""}${config.url || ""}`;
      const url = new URL(fullUrl, "http://mock.api");
      const request = new Request(url, {
        method: config.method?.toUpperCase(),
        headers: config.headers as HeadersInit,
        body: config.data ? JSON.stringify(config.data) : undefined,
      });

      // Get the mock response from our central resolver.
      const mockResponse = await resolve(request);

      // Create a custom axios adapter to return the mock response.
      config.adapter = async () => {
        // Gracefully handle responses that might not have a JSON body.
        const data = await mockResponse.json().catch(() => null);

        return Promise.resolve({
          data,
          status: mockResponse.status,
          statusText: mockResponse.statusText,
          headers: (() => {
            const h: Record<string, string> = {};
            mockResponse.headers.forEach((value, key) => {
              h[key] = value;
            });
            return h;
          })(),
          config: config,
          request: {},
        });
      };
    }

    return config;
  },
  (error) => {
    // This error handler is for the request setup, not the response.
    return Promise.reject(error);
  },
);

apiClient.interceptors.response.use(
  (response) => {
    if (API_DEBUG_MODE) {
      console.log(
        `[API Response] < ${response.status} ${response.config.method?.toUpperCase()} ${response.config.url}`,
        {
          data: response.data,
        },
      );
    }
    return response;
  },
  (error) => {
    if (API_DEBUG_MODE) {
      if (error.response) {
        console.error(
          `[API Error] < ${error.response.status} ${error.config.method?.toUpperCase()} ${error.config.url}`,
          {
            error: error.response.data,
          },
        );
      } else if (error.request) {
        console.error(`[API Error] No response for ${error.config.method?.toUpperCase()} ${error.config.url}`, error.request);
      } else {
        console.error('[API Error] Request setup failed', error.message);
      }
    }

    if (error.response?.status === 401) {
      // Handle unauthorized errors, e.g., redirect to login
      console.log("Unauthorized access, redirecting to login...");
    }
    return Promise.reject(error);
  },
);

export default apiClient;
