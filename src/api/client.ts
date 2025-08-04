/// <reference types="vite/client" />

import axios, { type AxiosInstance, type InternalAxiosRequestConfig, type AxiosResponse } from "axios";
import { API_DEBUG_MODE } from "./config";
import { getAccessToken, getRefreshToken, setTokens, updateAccessToken, removeTokens } from "@lib/tokenService";
import { resolve } from "./mocks/resolver";

const apiClient: AxiosInstance = axios.create({
  baseURL: "/api",
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Module-level store for in-flight refresh requests to prevent duplicate fetches
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: string | null) => void;
  reject: (error?: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });
  
  failedQueue = [];
};

apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // 1. Add the authentication token to the headers.
    const token = getAccessToken();
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (API_DEBUG_MODE) {
      console.log(`[API Request] > ${config.method?.toUpperCase()} ${config.url}`, JSON.stringify({
        payload: config.data,
      }, null, 2));
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
  (response: AxiosResponse) => {
    if (API_DEBUG_MODE) {
      console.log(
        `[API Response] < ${response.status} ${response.config.method?.toUpperCase()} ${response.config.url}`,
        JSON.stringify({
          data: response.data,
        }, null, 2),
      );
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
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

    // Handle 401 Unauthorized errors with token refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return apiClient(originalRequest);
        }).catch((err) => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = getRefreshToken();
      
      if (!refreshToken) {
        // No refresh token available, redirect to login
        removeTokens();
        window.location.href = '/login';
        return Promise.reject(error);
      }

      try {
        // Make refresh token request
        const response = await axios.post('/api/auth/refresh-token', {
          refreshToken
        });
        
        const { accessToken, refreshToken: newRefreshToken, expiresIn } = response.data;
        
        // Update tokens in storage
        if (newRefreshToken) {
          // Token rotation - update both tokens
          setTokens({
            accessToken,
            refreshToken: newRefreshToken,
            expiresAt: Date.now() + expiresIn * 1000
          });
        } else {
          // No token rotation - just update access token
          updateAccessToken(accessToken, expiresIn);
        }
        
        // Process queued requests
        processQueue(null, accessToken);
        
        // Retry the original request
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return apiClient(originalRequest);
        
      } catch (refreshError) {
        // Refresh token failed, clear tokens and redirect to login
        removeTokens();
        processQueue(refreshError, null);
        
        console.error('Refresh token failed:', refreshError);
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    
    return Promise.reject(error);
  },
);

export default apiClient;
