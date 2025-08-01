interface TokenData {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

interface TokenValidationResult {
  isValid: boolean;
  isExpired: boolean;
  timeUntilExpiry: number;
}

interface TokenChangeEvent {
  type: 'set' | 'update' | 'remove';
  tokenData?: TokenData;
  accessToken?: string;
  expiresAt?: number;
}

const ACCESS_TOKEN_KEY = 'authToken';
const REFRESH_TOKEN_KEY = 'refreshToken';
const EXPIRES_AT_KEY = 'tokenExpiresAt';
const TOKEN_CHANGE_EVENT = 'tokenChange';

/**
 * Get the current access token
 */
export const getAccessToken = (): string | null => {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
};

/**
 * Get the current refresh token
 */
export const getRefreshToken = (): string | null => {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
};

/**
 * Get the token expiration timestamp
 */
export const getExpiresAt = (): number | null => {
  const expiresAt = localStorage.getItem(EXPIRES_AT_KEY);
  return expiresAt ? parseInt(expiresAt, 10) : null;
};

/**
 * Set tokens and expiration
 */
export const setTokens = (tokenData: TokenData): void => {
  localStorage.setItem(ACCESS_TOKEN_KEY, tokenData.accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, tokenData.refreshToken);
  localStorage.setItem(EXPIRES_AT_KEY, tokenData.expiresAt.toString());
  
  // Dispatch token change event
  window.dispatchEvent(new CustomEvent(TOKEN_CHANGE_EVENT, {
    detail: { type: 'set', tokenData }
  }));
};

/**
 * Update only the access token (for refresh scenarios)
 */
export const updateAccessToken = (accessToken: string, expiresIn: number): void => {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  
  const expiresAt = Date.now() + expiresIn * 1000;
  localStorage.setItem(EXPIRES_AT_KEY, expiresAt.toString());
  
  // Dispatch token change event
  window.dispatchEvent(new CustomEvent(TOKEN_CHANGE_EVENT, {
    detail: { type: 'update', accessToken, expiresAt }
  }));
};

/**
 * Remove all tokens
 */
export const removeTokens = (): void => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(EXPIRES_AT_KEY);
  
  // Dispatch token change event
  window.dispatchEvent(new CustomEvent(TOKEN_CHANGE_EVENT, {
    detail: { type: 'remove' }
  }));
};

/**
 * Check if token is valid and not expired
 */
export const isTokenValid = (): boolean => {
  const token = getAccessToken();
  const expiresAt = getExpiresAt();
  
  if (!token || !expiresAt) {
    return false;
  }
  
  return Date.now() < expiresAt;
};

/**
 * Check if token is expired
 */
export const isTokenExpired = (): boolean => {
  const expiresAt = getExpiresAt();
  if (!expiresAt) {
    return true;
  }
  
  return Date.now() >= expiresAt;
};

/**
 * Get time until token expires in milliseconds
 */
export const getTimeUntilExpiry = (): number => {
  const expiresAt = getExpiresAt();
  if (!expiresAt) {
    return 0;
  }
  
  return Math.max(0, expiresAt - Date.now());
};

/**
 * Validate token and return detailed result
 */
export const validateToken = (): TokenValidationResult => {
  const token = getAccessToken();
  const expiresAt = getExpiresAt();
  const timeUntilExpiry = getTimeUntilExpiry();
  
  const isValid = !!(token && expiresAt);
  const isExpired = !isValid || timeUntilExpiry === 0;
  
  return {
    isValid,
    isExpired,
    timeUntilExpiry
  };
};

/**
 * Check if token will expire within the given time (in milliseconds)
 */
export const willExpireWithin = (timeMs: number): boolean => {
  const timeUntilExpiry = getTimeUntilExpiry();
  return timeUntilExpiry > 0 && timeUntilExpiry <= timeMs;
};

/**
 * Listen for token changes
 */
export const onTokenChange = (callback: (event: CustomEvent<TokenChangeEvent>) => void): () => void => {
  const handler = (event: Event) => {
    callback(event as CustomEvent<TokenChangeEvent>);
  };
  
  window.addEventListener(TOKEN_CHANGE_EVENT, handler);
  
  // Return cleanup function
  return () => {
    window.removeEventListener(TOKEN_CHANGE_EVENT, handler);
  };
};

/**
 * Get all token data
 */
export const getTokenData = (): TokenData | null => {
  const accessToken = getAccessToken();
  const refreshToken = getRefreshToken();
  const expiresAt = getExpiresAt();
  
  if (!accessToken || !refreshToken || !expiresAt) {
    return null;
  }
  
  return {
    accessToken,
    refreshToken,
    expiresAt
  };
};

// Export types
export type { TokenData, TokenValidationResult, TokenChangeEvent }; 