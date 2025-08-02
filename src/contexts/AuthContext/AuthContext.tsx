import React, { useState, useCallback, useEffect, useMemo } from "react";
import type { AuthenticatedUser } from "types/auth";
import type { AuthContextType } from "./types";
import { AuthContext } from "./context";
import { useLogin, useLogout } from "@api/domains/auth/hooks";
import { useUser } from "@api/domains/users/hooks";
import {
  getAccessToken,
  getExpiresAt,
  setTokens,
  removeTokens,
  onTokenChange,
  validateToken,
  willExpireWithin,
} from "@lib/tokenService";
import { useCache } from "@contexts/CacheContext";

// eslint-disable-next-line max-lines-per-function
const useAuthProvider = (): AuthContextType => {
  const [user, setUser] = useState<AuthenticatedUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState<string | null>(getAccessToken());
  const [tokenExpiresAt, setTokenExpiresAt] = useState<number | null>(
    getExpiresAt()
  );
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const { mutateAsync: loginUser } = useLogin();
  const { mutateAsync: logoutUser } = useLogout();
  const { data: userData } = useUser();
  const { invalidateByPattern } = useCache();

  const clearAuthState = useCallback(() => {
    setToken(null);
    setTokenExpiresAt(null);
    setIsAuthenticated(false);
  }, []);

  const validateTokenState = useCallback(() => {
    const validation = validateToken();

    if (!validation.isValid || validation.isExpired) {
      if (validation.isExpired) {
        removeTokens();
      }
      clearAuthState();
      return;
    }

    setIsAuthenticated(true);

    if (willExpireWithin(5 * 60 * 1000)) {
      console.log("Token expires soon, triggering proactive refresh...");
    }
  }, [clearAuthState]);

  const login = useCallback(
    async (username: string, password: string): Promise<void> => {
      try {
        const { auth } = await loginUser({ username, password });

        const { token: userToken, refreshToken, expiresIn } = auth;

        const expirationTime = Date.now() + expiresIn * 1000;

        setTokens({
          accessToken: userToken,
          refreshToken,
          expiresAt: expirationTime,
        });
        setToken(userToken);
        setTokenExpiresAt(expirationTime);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Login failed:", error);
        throw error;
      }
    },
    [loginUser]
  );

  const logout = useCallback(async () => {
    // Invalidate user cache before clearing auth state
    await invalidateByPattern("^async-data:user:me$");
    setUser(null);
    clearAuthState();
    removeTokens();

    try {
      await logoutUser();
    } catch (error) {
      console.error("Logout request failed:", error);
    }
  }, [clearAuthState, logoutUser, invalidateByPattern]);

  // Listen for token changes from TokenService
  useEffect(() => {
    const cleanup = onTokenChange((event) => {
      const { type, tokenData, accessToken, expiresAt } = event.detail;

      switch (type) {
        case "set":
          setToken(tokenData!.accessToken);
          setTokenExpiresAt(tokenData!.expiresAt);
          break;
        case "update":
          setToken(accessToken!);
          setTokenExpiresAt(expiresAt!);
          break;
        case "remove":
          clearAuthState();
          break;
      }
    });

    return cleanup;
  }, [clearAuthState]);

  // Continuous token validation
  useEffect(() => {
    validateTokenState();
    const interval = setInterval(validateTokenState, 60 * 1000);
    return () => clearInterval(interval);
  }, [validateTokenState]);

  // Update user state when userData changes
  useEffect(() => {
    if (userData?.error) {
      invalidateByPattern("^async-data:user:me$");
      setIsLoading(false);
      return;
    }

    if (userData && token) {
      setUser(userData.user);
      setIsLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData, token]);

  const hasRole = useCallback(
    (roles: string[]) => {
      if (!user) return false;
      return roles.includes(user.platformRole);
    },
    [user]
  );

  const hasPlan = useCallback(
    (plans: string[]) => {
      if (!user || !user.plan) return false;
      return plans.includes(user.plan);
    },
    [user]
  );

  return useMemo(
    () => ({
      user,
      token,
      tokenExpiresAt,
      isLoading,
      isAuthenticated,
      login,
      logout,
      hasRole,
      hasPlan,
    }),
    [
      user,
      token,
      tokenExpiresAt,
      isLoading,
      isAuthenticated,
      login,
      logout,
      hasRole,
      hasPlan,
    ]
  );
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const value = useAuthProvider();
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
