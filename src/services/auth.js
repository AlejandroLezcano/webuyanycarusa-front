/**
 * Auth Service - Handles all authentication-related API calls
 * Implements Single Responsibility Principle (SRP)
 *
 * SECURITY: Uses tokenManager for safe in-memory token storage
 */

import { httpClient } from "./utils/httpClient";
import { setToken, clearToken } from "./utils/tokenManager";

// Credentials pulled from .env (do NOT hardcode)
const ENV_USERNAME = import.meta.env.VITE_AUTH_USERNAME;
const ENV_PASSWORD = import.meta.env.VITE_AUTH_PASSWORD;

/**
 * Performs login using credentials from the environment
 * and securely stores the JWT token.
 *
 * @param {number} retries - Number of retry attempts (default: 3)
 * @returns {Promise<Object>} Login response payload
 */
export const authLogin = async (retries = 3) => {
  try {
    // Uses httpClient which already has the Base URL configured
    const response = await httpClient.post('/auth/login', {
      username: ENV_USERNAME,
      password: ENV_PASSWORD,
    });

    const { token, expiration, expiresIn, expiresAt } = response.data;

    if (!token) {
      console.error("❌ Login response missing token:", response.data);
      throw new Error("Token missing in login response");
    }

    // Compute expiration in seconds
    const computedExpiresIn =
      expiresIn ||
      (expiresAt
        ? Math.floor((new Date(expiresAt) - Date.now()) / 1000)
        : expiration
          ? Math.floor((new Date(expiration) - Date.now()) / 1000)
          : 3600);

    // Store token securely
    setToken(token, computedExpiresIn);

    return response.data;

  } catch (error) {
    console.error("Login error:", error);

    if (retries > 0) {
      console.warn(`Retrying login... (${3 - retries + 1})`);
      return authLogin(retries - 1);
    }

    throw error;
  }
};

/**
 * Logs out the user by clearing the stored JWT token.
 */
export const logout = () => {
  clearToken();
};
