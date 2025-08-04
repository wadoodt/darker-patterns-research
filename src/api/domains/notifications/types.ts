// Moved from src/types/api/notifications.ts

export type Notification = {
  id: string;
  userId: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  updatedAt: string;
  type: "system" | "user" | "payment" | "reply" | "campaign" | "warning" | "success" | "info";
  action?: {
    route: string;
    label: string;
  };
};

export interface NotificationsQueryResponse {
  notifications: Notification[];
  totalItems: number;
  page: number;
  totalPages: number;
}

export type MarkNotificationAsReadResponse = {
  notification: Notification;
};

export type MarkAllNotificationsAsReadResponse = {
  notifications: {
    message: string;
  };
};
