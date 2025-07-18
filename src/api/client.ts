/// <reference types="vite/client" />

import axios from 'axios';

const apiClient = axios.create({
  baseURL: '/api',
});

import { resolve } from './mocks/resolver';

apiClient.interceptors.request.use(
  async (config) => {
    // 1. Add the authentication token to the headers.
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // 2. If mocks are enabled, intercept the request and use the mock resolver.
    if (import.meta.env.VITE_USE_MOCKS === 'true') {
      // The resolver needs a standard Request object. We build one from the axios config.
      // A dummy base is required for the URL constructor.
      const fullUrl = `${config.baseURL || ''}${config.url || ''}`;
      console.log(fullUrl);
      const url = new URL(fullUrl, 'http://mock.api');
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
  }
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized errors, e.g., redirect to login
      console.log('Unauthorized access, redirecting to login...');
    }
    return Promise.reject(error);
  }
);

export default apiClient;

