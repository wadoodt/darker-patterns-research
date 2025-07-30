/**
 * @file Raw async functions for the Notifications domain.
 */
import apiClient from "@api/client";
import { handleQuery } from "@api/lib/handleQuery";
import { handleMutation } from "@api/lib/handleMutation";
import type { ApiResponse } from "types";
import type { NotificationsQueryResponse } from "./types";

/**
 * Fetches a paginated list of notifications.
 */
const query = (page: number, limit = 10): Promise<NotificationsQueryResponse> => {
  return handleQuery(() =>
    apiClient.get(`/notifications?page=${page}&limit=${limit}`),
  );
};

/**
 * Marks a single notification as read.
 */
const markAsRead = (id: string): Promise<ApiResponse<null>> => {
  return handleMutation(() => apiClient.patch(`/notifications/${id}/read`));
};

/**
 * Marks all notifications as read for the current user.
 */
const markAllAsRead = (): Promise<ApiResponse<null>> => {
  return handleMutation(() => apiClient.patch("/notifications/read-all"));
};

export const notifications = {
  query,
  markAsRead,
  markAllAsRead,
};
