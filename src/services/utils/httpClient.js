/**
 * HTTP Client - Centralized Axios configuration
 * Implements Dependency Inversion Principle (DIP)
 *
 * SECURITY: Integrated with tokenManager for safe authentication handling
 */

import axios from 'axios';
import { getToken, clearToken } from './tokenManager';

// Normalize backend URL to avoid double-slash issues
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api').replace(/\/+$/, "");

/**
 * Axios instance with default configuration
 */
export const httpClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false, // SECURITY: Avoid leaking cookies
});

/**
 * Request Interceptor
 * Adds JWT token to every outgoing request when available
 */
httpClient.interceptors.request.use(
  (config) => {
    const token = getToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.debug('[API] No token available - request may fail if protected');
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Response Interceptor
 * Centralized error handling + token cleanup on unauthorized responses
 */
httpClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response) {
      const { status, data } = error.response;

      switch (status) {
        case 401:
          console.debug('[API] Unauthorized - token invalid or expired');
          clearToken();
          break;

        case 403:
          console.debug('[API] Forbidden - insufficient permissions');
          break;

        case 404:
          console.debug('[API] Not found:', data?.message || '');
          break;

        case 429:
          console.debug('[API] Rate limited');
          break;

        case 500:
          console.debug('[API] Server error');
          break;

        default:
          console.debug('[API] Error:', status, data?.message || error.message);
      }
    }
    // No response received (network dropped, CORS blocked, API offline)
    else if (error.request) {
      console.debug('[API] Network error:', error.message);
    }
    // Client exception
    else {
      console.debug('[API] Unexpected error:', error.message);
    }

    return Promise.reject(error);
  }
);

export default httpClient;
