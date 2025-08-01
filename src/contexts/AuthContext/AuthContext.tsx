import React, { useState, useCallback, useEffect, useMemo } from "react";
import apiClient from "@api/client";
import type { AuthenticatedUser } from "types/auth";
import type { AuthContextType } from "./types";
import { AuthContext } from "./context";
import { useLogin } from "@api/domains/auth/hooks";
import { useUser } from "@api/domains/users/hooks";
import type { UserMeResponse } from "@api/domains/users/index";
import { 
  getAccessToken, 
  getExpiresAt, 
  setTokens, 
  removeTokens, 
  onTokenChange, 
  validateToken, 
  willExpireWithin 
} from "@lib/tokenService";

const useAuthProvider = (): AuthContextType => {
  const [user, setUser] = useState<AuthenticatedUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState<string | null>(getAccessToken());
  const [tokenExpiresAt, setTokenExpiresAt] = useState<number | null>(getExpiresAt());
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const { mutateAsync: loginUser } = useLogin();
  const { data: userData } = useUser();

  // Listen for token changes from TokenService
  useEffect(() => {
    const cleanup = onTokenChange((event) => {
      const { type, tokenData, accessToken, expiresAt } = event.detail;
      
      switch (type) {
        case 'set':
          setToken(tokenData!.accessToken);
          setTokenExpiresAt(tokenData!.expiresAt);
          break;
        case 'update':
          setToken(accessToken!);
          setTokenExpiresAt(expiresAt!);
          break;
        case 'remove':
          setToken(null);
          setTokenExpiresAt(null);
          break;
      }
    });

    return cleanup;
  }, []);

  // Continuous token validation
  useEffect(() => {
    const validateTokenState = () => {
      const validation = validateToken();
      
      if (!validation.isValid) {
        // Token is invalid, clear state
        setToken(null);
        setTokenExpiresAt(null);
        setIsAuthenticated(false);
        return;
      }

      if (validation.isExpired) {
        // Token is expired, clear state
        removeTokens();
        setToken(null);
        setTokenExpiresAt(null);
        setIsAuthenticated(false);
        return;
      }

      // Token is valid
      setIsAuthenticated(true);
      
      // Proactive refresh: if token expires within 5 minutes, trigger refresh
      if (willExpireWithin(5 * 60 * 1000)) {
        console.log('Token expires soon, triggering proactive refresh...');
        // The API client will handle the refresh automatically on next request
      }
    };

    // Initial validation
    validateTokenState();

    // Set up periodic validation (every minute)
    const interval = setInterval(validateTokenState, 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (userData && token) {
      const { user: fetchedUser, unreadNotifications } = userData;
      const userWithPlan = fetchedUser as UserMeResponse;
      setUser({
        ...fetchedUser,
        plan: (userWithPlan.plan as "Enterprise" | "Pro" | "Free") || "Free",
        createdAt: userWithPlan.createdAt || new Date().toISOString(),
        updatedAt: userWithPlan.updatedAt || new Date().toISOString(),
        notifications: unreadNotifications,
      });
      setIsLoading(false);
    }
  }, [userData, token]);

  const login = useCallback(
    async (username: string, password: string): Promise<void> => {
      try {
        const {
          user: userData,
          token: userToken,
          refreshToken,
          expiresIn,
          notifications,
        } = await loginUser({ username, password });

        const expirationTime = Date.now() + expiresIn * 1000;
        
        // Use TokenService to set tokens
        setTokens({
          accessToken: userToken,
          refreshToken,
          expiresAt: expirationTime
        });

        setUser({ ...userData, notifications: notifications.unread });
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
    setUser(null);
    setToken(null);
    setTokenExpiresAt(null);
    setIsAuthenticated(false);
    
    // Use TokenService to remove tokens
    removeTokens();

    try {
      const response = await apiClient.post("/auth/logout");
      if (response.data.error) {
        console.error(
          "Server-side logout failed:",
          response.data.error.message
        );
      }
    } catch (error) {
      console.error("Logout request failed:", error);
    }
  }, []);

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
