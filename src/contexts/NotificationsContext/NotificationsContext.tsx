import { useState, useCallback, useMemo } from 'react';
import { useCache } from '@contexts/CacheContext';
import { useAuth } from '@hooks/useAuth';
import api from '@api/index';
import { NotificationsContext } from './context';
import type { Notification } from '@api/domains/notifications/types';
import { ApiError } from '@api/lib/ApiError';

export const NotificationsProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const { invalidateByPattern } = useCache();
  const [currentPage, setCurrentPage] = useState(1);
  const [isEnabled, setIsEnabled] = useState(false);
  const [manualNotifications] = useState<Notification[]>(user?.unreadNotifications ?? []);

  const enable = useCallback(() => setIsEnabled(true), []);

  const {
    data: queryResult,
    loading,
    error,
    refresh,
  } = api.notifications.useNotificationsQuery(currentPage, { enabled: isEnabled });

  // Combine initial notifications from login with fetched ones.
  const allNotifications = useMemo(() => {
    const fetchedNotifications = queryResult?.data ?? [];
    const notificationsMap = new Map<string, Notification>();
    [...manualNotifications, ...fetchedNotifications].forEach(n => notificationsMap.set(n.id, n));
    return Array.from(notificationsMap.values());
  }, [manualNotifications, queryResult]);

  const unreadCount = useMemo(() => {
    return allNotifications.filter(n => !n.read).length;
  }, [allNotifications]);

  const hasMore = queryResult ? queryResult.data.length >= 10 : false;

  const markAsRead = useCallback(
    async (id: string) => {
      const response = await api.notifications.markAsRead(id);
      if (!response.error) {
        await invalidateByPattern('^notifications');
      } else {
        console.error('Failed to mark notification as read', response.error);
        // Here we could use Sonner to show a toast
      }
    },
    [invalidateByPattern]
  );

  const markAllAsRead = useCallback(async () => {
    const response = await api.notifications.markAllAsRead();
    if (!response.error) {
      await invalidateByPattern('^notifications');
    } else {
      console.error('Failed to mark all notifications as read', response.error);
    }
  }, [invalidateByPattern]);
  
  const errorMessage = useMemo(() => {
    if (error instanceof ApiError) return error.message; // i18n key
    return error ? 'UNEXPECTED_ERROR' : null;
  }, [error]);

  const fullRefresh = useCallback(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
    refresh();
  }, [currentPage, refresh]);

  const fetchMore = useCallback(async () => {
    if (hasMore && !loading) {
      setCurrentPage(prev => prev + 1);
    }
  }, [hasMore, loading]);

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
