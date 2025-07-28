import { useState, useCallback, useEffect } from 'react';
import type { Notification } from 'types/api/notifications';
import { useCache } from '@contexts/CacheContext';
import { api } from '@lib/api';
import { NotificationsContext } from './context';

export const NotificationsProvider = ({ children }: { children: React.ReactNode }) => {
  const { set: setCache, get: getCache } = useCache();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  // Load from cache on mount
  useEffect(() => {
    const loadFromCache = async () => {
      const cachedNotifications = await getCache<Notification[]>('notifications');
      const cachedUnreadCount = await getCache<number>('unreadCount');
      
      if (cachedNotifications) {
        setNotifications(cachedNotifications);
      }
      if (cachedUnreadCount !== null) {
        setUnreadCount(cachedUnreadCount);
      }
    };
    
    loadFromCache();
  }, [getCache]);

  const fetchNotifications = useCallback(async (pageNum = 1) => {
    setLoading(true);
    try {
      const response = await api.get(`/notifications?page=${pageNum}&limit=10`);
      const newNotifications = pageNum === 1 
        ? response.data
        : [...notifications, ...response.data];
      
      setNotifications(newNotifications);
      const newUnreadCount = newNotifications.filter((n: Notification) => !n.read).length;
      setUnreadCount(newUnreadCount);
      setHasMore(response.data.length === 10);
      
      // Update cache
      await setCache('notifications', newNotifications);
      await setCache('unreadCount', newUnreadCount);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to fetch notifications');
    } finally {
      setLoading(false);
    }
  }, [notifications, setCache]);

  const markAsRead = useCallback(async (id: string) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      const updated = notifications.map(n => 
        n.id === id ? { ...n, read: true } : n
      );
      setNotifications(updated);
      const newUnreadCount = updated.filter((n: Notification) => !n.read).length;
      setUnreadCount(newUnreadCount);
      
      // Update cache
      await setCache('notifications', updated);
      await setCache('unreadCount', newUnreadCount);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to mark notification as read');
    }
  }, [notifications, setCache]);

  const markAllAsRead = useCallback(async () => {
    try {
      await api.patch('/notifications/read-all');
      const updated = notifications.map(n => ({ ...n, read: true }));
      setNotifications(updated);
      setUnreadCount(0);
      
      // Update cache
      await setCache('notifications', updated);
      await setCache('unreadCount', 0);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to mark all notifications as read');
    }
  }, [notifications, setCache]);

  const fetchMore = useCallback(() => {
    if (hasMore && !loading) {
      setPage(p => p + 1);
      fetchNotifications(page + 1);
    }
  }, [hasMore, loading, page, fetchNotifications]);

  const refresh = useCallback(() => {
    setPage(1);
    fetchNotifications(1);
  }, [fetchNotifications]);

  return (
    <NotificationsContext.Provider 
      value={{
        notifications,
        unreadCount,
        loading,
        error,
        markAsRead,
        markAllAsRead,
        fetchMore,
        hasMore,
        refresh
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
};
