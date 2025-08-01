import React, { useState, useCallback, useEffect, useMemo } from "react";
import apiClient from "@api/client";
import type { AuthenticatedUser } from "types/auth";
import type { AuthContextType } from "./types";
import { AuthContext } from "./context";
import { useLogin } from "@api/domains/auth/hooks";
import { useUser } from "@api/domains/users/hooks";
import type { UserMeResponse } from "@api/domains/users/index";

const useAuthProvider = (): AuthContextType => {
  const [user, setUser] = useState<AuthenticatedUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("authToken")
  );
  const [tokenExpiresAt, setTokenExpiresAt] = useState<number | null>(
    JSON.parse(localStorage.getItem("tokenExpiresAt") || Date.now().toString())
  );
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const { mutateAsync: loginUser } = useLogin();
  const { data: userData } = useUser();

  useEffect(() => {
    if (token && tokenExpiresAt) {
      const isValid = Date.now() < tokenExpiresAt;

      if (!isValid) {
        localStorage.removeItem("authToken");
        localStorage.removeItem("tokenExpiresAt");
        setTokenExpiresAt(null);
        setToken(null);
      }
      setIsAuthenticated(isValid);
    } else {
      setIsAuthenticated(false);
    }
  }, [token, tokenExpiresAt]);

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
          expiresIn,
          notifications,
        } = await loginUser({ username, password });

        const expirationTime = Date.now() + expiresIn * 1000;
        setUser({ ...userData, notifications: notifications.unread });
        setToken(userToken);
        setTokenExpiresAt(expirationTime);
        setIsAuthenticated(true);
        localStorage.setItem("authToken", userToken);
        localStorage.setItem("tokenExpiresAt", expirationTime.toString());
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
    localStorage.removeItem("authToken");
    localStorage.removeItem("tokenExpiresAt");

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
