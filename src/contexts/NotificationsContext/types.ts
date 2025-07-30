import type { Notification } from '@api/domains/notifications/types';

export type NotificationsContextType = {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  hasMore: boolean;
  refresh: () => void;
  fetchMore: () => Promise<void>;
  enable: () => void;
};
