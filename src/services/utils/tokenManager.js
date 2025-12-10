/**
 * Token Manager - Secure in-memory JWT storage
 * SECURITY: Keeps tokens out of sessionStorage/localStorage to prevent XSS theft.
 *
 * IMPORTANT:
 *  - Tokens live ONLY in memory.
 *  - Clearing the token wipes both value and expiration atomically.
 */

// In-memory variables (not exposed to window)
let authToken = null;
let tokenExpiry = null;

/**
 * Stores JWT token securely in memory.
 * @param {string} token - JWT token
 * @param {number} expiresIn - Expiration time in seconds (default: 3600)
 */
export const setToken = (token, expiresIn = 3600) => {
  if (!token || typeof token !== "string") {
    console.error("setToken(): invalid token provided");
    return;
  }

  authToken = token;
  tokenExpiry = Date.now() + expiresIn * 1000;
};

/**
 * Retrieves the JWT token only if valid.
 * @returns {string|null} JWT token or null if expired/missing
 */
export const getToken = () => {
  if (!authToken) return null;

  // Expired token → destroy it
  if (tokenExpiry && Date.now() > tokenExpiry) {
    clearToken();
    return null;
  }

  return authToken;
};

/**
 * Securely clears the token from memory.
 * Prevents partial clears or stale expiration.
 */
export const clearToken = () => {
  authToken = null;
  tokenExpiry = null;
};

/**
 * Checks if the stored token is currently valid.
 * @returns {boolean}
 */
export const hasValidToken = () => {
  return getToken() !== null;
};

/**
 * Returns remaining lifetime (seconds) for the JWT token.
 * @returns {number} seconds remaining or 0
 */
export const getTokenTimeRemaining = () => {
  if (!tokenExpiry) return 0;
  return Math.max(0, Math.floor((tokenExpiry - Date.now()) / 1000));
};

/**
 * OPTIONAL: Migrate token from sessionStorage → in-memory.
 * Disabled by default for maximum security.
 *
 * Uncomment only if you're transitioning from an older build
 * and need backward compatibility.
 */
/*
if (typeof window !== "undefined" && window.sessionStorage) {
  const oldToken = sessionStorage.getItem("token");
  if (oldToken) {
    console.warn("⚠️ Migrating token from sessionStorage → secure in-memory");
    setToken(oldToken);
    sessionStorage.removeItem("token");
  }
}
*/
