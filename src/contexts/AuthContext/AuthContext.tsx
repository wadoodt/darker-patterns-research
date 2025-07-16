import React, { useState, useCallback, useEffect } from 'react';
import apiClient from '@api/client';
import type { User, ApiResponse } from 'types';
import type { AuthContextType } from './types';
import { AuthContext } from './context';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('authToken'));
  const [tokenExpiresAt, setTokenExpiresAt] = useState<number | null>(
    JSON.parse(localStorage.getItem('tokenExpiresAt') || 'null')
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkUserSession = async () => {
      const storedToken = localStorage.getItem('authToken');
      const storedExpiration = localStorage.getItem('tokenExpiresAt');
      const expiresAt = storedExpiration ? JSON.parse(storedExpiration) : null;

      if (storedToken && expiresAt && Date.now() < expiresAt) {
        try {
          const { data: response } = await apiClient.get('/auth/me');
          if (response.data) {
            setUser(response.data.user);
            setToken(storedToken);
            setTokenExpiresAt(expiresAt);
          } else {
            throw new Error(response.data.error?.message || 'Invalid session');
          }
          setToken(storedToken);
          setTokenExpiresAt(expiresAt);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
          // Token is invalid, clear session
          setUser(null);
          setToken(null);
          setTokenExpiresAt(null);
          localStorage.removeItem('authToken');
          localStorage.removeItem('tokenExpiresAt');
        }
      }
      setIsLoading(false);
    };

    checkUserSession();
  }, [token]);

  const login = useCallback(async (username: string, password: string) => {
    try {
      const { data: response } = await apiClient.post('/auth/login', { username, password });

      if (response.error) {
        throw new Error(response.error.message);
      }
      if (response.data) {
        const { user: userData, token: userToken, expiresIn } = response.data;
        const expirationTime = Date.now() + expiresIn * 1000;

        setUser(userData);
        setToken(userToken);
        setTokenExpiresAt(expirationTime);
        localStorage.setItem('authToken', userToken);
        localStorage.setItem('tokenExpiresAt', expirationTime.toString());
      }
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    // Immediately clear local session information for a responsive UI.
    setUser(null);
    setToken(null);
    setTokenExpiresAt(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('tokenExpiresAt');

    try {
      // Notify the backend to invalidate the token.
      const response = await apiClient.post<ApiResponse<null>>('/auth/logout');

      if (response.data.error) {
        // Log if the server-side logout fails, but don't disrupt the user.
        console.error('Server-side logout failed:', response.data.error.message);
      }
    } catch (error) {
      // This catches network errors or non-2xx responses.
      console.error('Logout request failed:', error);
    }
  }, []);

  const hasRole = useCallback((roles: string[]): boolean => {
    if (!user) return false;
    // Adapt role-checking to plan-checking
    return roles.includes(user.plan);
  }, [user]);

  const isAuthenticated = useCallback((): boolean => {
    return !!token && !!tokenExpiresAt && Date.now() < tokenExpiresAt;
  }, [token, tokenExpiresAt]);

  const value: AuthContextType = {
    user,
    token,
    tokenExpiresAt,
    isLoading,
    login,
    logout,
    hasRole,
    isAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
