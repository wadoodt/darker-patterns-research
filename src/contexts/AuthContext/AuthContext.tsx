import React, { useState, useCallback, useEffect, useMemo } from "react";
import apiClient from "@api/client";
import type { ApiResponse } from "types";
import type { AuthenticatedUser } from "types/auth";
import type { AuthContextType } from "./types";
import { AuthContext } from "./context";

async function checkUserSession(
  setUser: React.Dispatch<React.SetStateAction<AuthenticatedUser | null>>,
  setToken: React.Dispatch<React.SetStateAction<string | null>>,
  setTokenExpiresAt: React.Dispatch<React.SetStateAction<number | null>>,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
) {
  const storedToken = localStorage.getItem("authToken");
  const storedExpiration = localStorage.getItem("tokenExpiresAt");
  const expiresAt = storedExpiration ? JSON.parse(storedExpiration) : null;

  if (storedToken && expiresAt && Date.now() < expiresAt) {
    try {
      const { data: response } = await apiClient.get("/users/me");
      if (response.data) {
        setUser(response.data.user);
        setToken(storedToken);
        setTokenExpiresAt(expiresAt);
      } else {
        throw new Error(response.data.error?.message || "Invalid session");
      }
      setToken(storedToken);
      setTokenExpiresAt(expiresAt);
    } catch {
      setUser(null);
      setToken(null);
      setTokenExpiresAt(null);
      localStorage.removeItem("authToken");
      localStorage.removeItem("tokenExpiresAt");
    }
  }
  setIsLoading(false);
}

const useAuthProvider = (): AuthContextType => {
  const [user, setUser] = useState<AuthenticatedUser | null>(null);
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("authToken"),
  );
  const [tokenExpiresAt, setTokenExpiresAt] = useState<number | null>(
    JSON.parse(localStorage.getItem("tokenExpiresAt") || "null"),
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkUserSession(setUser, setToken, setTokenExpiresAt, setIsLoading);
  }, [token]);

  const login = useCallback(async (username: string, password: string) => {
    try {
      const { data: response } = await apiClient.post("/auth/login", {
        username,
        password,
      });

      if (response.error) {
        throw new Error(response.error.message);
      }
      if (response.data) {
        const { user: userData, token: userToken, expiresIn } = response.data;
        const expirationTime = Date.now() + expiresIn * 1000;

        setUser(userData);
        setToken(userToken);
        setTokenExpiresAt(expirationTime);
        localStorage.setItem("authToken", userToken);
        localStorage.setItem("tokenExpiresAt", expirationTime.toString());
      }
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    setUser(null);
    setToken(null);
    setTokenExpiresAt(null);
    localStorage.removeItem("authToken");
    localStorage.removeItem("tokenExpiresAt");

    try {
      const response = await apiClient.post<ApiResponse<null>>("/auth/logout");

      if (response.data.error) {
        console.error(
          "Server-side logout failed:",
          response.data.error.message,
        );
      }
    } catch (error) {
      console.error("Logout request failed:", error);
    }
  }, []);

  const hasRole = useCallback(
    (roles: string[]): boolean => {
      if (!user) return false;
      return roles.includes(user.platformRole);
    },
    [user],
  );

  const hasPlan = useCallback(
    (plans: string[]): boolean => {
      if (!user || !user.plan) return false;
      return plans.includes(user.plan);
    },
    [user],
  );

  const isAuthenticated = useCallback((): boolean => {
    return !!token && !!tokenExpiresAt && Date.now() < tokenExpiresAt;
  }, [token, tokenExpiresAt]);

  return useMemo(
    () => ({
      user,
      token,
      tokenExpiresAt,
      isLoading,
      login,
      logout,
      hasRole,
      hasPlan,
      isAuthenticated,
    }),
    [
      user,
      token,
      tokenExpiresAt,
      isLoading,
      login,
      logout,
      hasRole,
      hasPlan,
      isAuthenticated,
    ],
  );
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const value = useAuthProvider();
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
