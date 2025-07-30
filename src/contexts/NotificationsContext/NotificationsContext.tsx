import { useState, useCallback, useMemo } from 'react';
import type { Notification } from 'types/api/notifications';
import { useCache } from '@contexts/CacheContext';
import { useAsyncCache } from '@hooks/useAsyncCache';
import apiClient from "@api/client";
import { CacheLevel } from '@lib/cache/types';
import { AxiosError } from 'axios';
import { NotificationsContext } from './context';

// Fetches a single page of notifications.
const fetchNotificationsPage = async (page: number) => {
  const { data: response } = await apiClient.get<{ data: { data: Notification[] } }>(
    `/notifications?page=${page}&limit=10`
  );
  return response.data.data;
};

import { useAuth } from '@hooks/useAuth';

export const NotificationsProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const { invalidateByPattern } = useCache();
  const [currentPage, setCurrentPage] = useState(1);
  const [isEnabled, setIsEnabled] = useState(false);
  const [manualNotifications] = useState<Notification[]>(user?.notifications ?? []);


  const enable = useCallback(() => {
    setIsEnabled(true);
  }, []);

  const {
    data: fetchedNotifications,
    loading,
    error,
    refresh,
  } = useAsyncCache(
    ['notifications', currentPage],
    () => fetchNotificationsPage(currentPage),
    CacheLevel.DEBUG,
    { enabled: isEnabled }
  );

  const allNotifications = useMemo(() => {
    const notificationsMap = new Map<string, Notification>();
    [...manualNotifications, ...(fetchedNotifications ?? [])].forEach(n => notificationsMap.set(n.id, n));
    return Array.from(notificationsMap.values());
  }, [manualNotifications, fetchedNotifications]);

  const unreadCount = useMemo(() => {
    if (!allNotifications) return 0;
    return allNotifications.filter(notification => !notification.read).length;
  }, [allNotifications]);

  // Note: This provider is now paginated, following the pattern in useTeamPage.
  // The previous infinite scroll implementation was not compatible with useAsyncCache.
  // UI components consuming this context may need to be updated to handle pagination.
  const hasMore = fetchedNotifications ? fetchedNotifications.length >= 10 : false;

  const markAsRead = useCallback(
    async (id: string) => {
      try {
        await apiClient.patch(`/notifications/${id}/read`);
        // Refresh data by invalidating cache
        await invalidateByPattern('^notifications');
      } catch (err) {
        console.error('Failed to mark notification as read', err);
        // Propagate error to the UI if needed
      }
    },
    [invalidateByPattern]
  );

  const markAllAsRead = useCallback(async () => {
    try {
      await apiClient.patch('/notifications/read-all');
      // Refresh data by invalidating cache
      await invalidateByPattern('^notifications');
    } catch (err) {
      console.error('Failed to mark all notifications as read', err);
    }
  }, [invalidateByPattern]);

  const errorMessage = useMemo(() => {
    if (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      if (axiosError.response?.data?.message) {
        return axiosError.response.data.message;
      }
      return 'Failed to fetch notifications';
    }
    return null;
  }, [error]);

  // Combines refresh of list and stats
  const fullRefresh = useCallback(() => {
    if (currentPage !== 1) {
        setCurrentPage(1);
    }
    refresh();
  }, [currentPage, refresh]);

  const fetchMore = useCallback(async () => {
    setCurrentPage(prev => prev + 1);
  }, []);

  return (
    <NotificationsContext.Provider
      value={{
        notifications: allNotifications,
        unreadCount,
        loading,
        error: errorMessage,
        markAsRead,
        markAllAsRead,
        currentPage,
        setCurrentPage,
        hasMore,
        refresh: fullRefresh,
        fetchMore,
        enable
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
};
