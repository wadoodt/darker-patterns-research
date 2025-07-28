export type Notification = {
  id: string;
  userId: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  updatedAt: string;
  type: 'system' | 'user' | 'payment' | 'reply';
  action?: {
    route: string;
    label: string;
  };
}

export interface NotificationListResponse {
  data: Notification[];
  total: number;
  page: number;
  limit: number;
}

export interface MarkAsReadResponse {
  success: boolean;
  count: number;
}
