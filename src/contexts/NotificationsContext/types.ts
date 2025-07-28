export type NotificationType = 'system' | 'user' | 'payment' | 'reply';

export interface NotificationAction {
  route: string;
  label: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  updatedAt: string;
  action?: NotificationAction;
}

export interface NotificationsContextType {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  fetchMore: () => void;
  hasMore: boolean;
  refresh: () => void;
}
