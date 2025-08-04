/**
 * @file Raw async functions for the Notifications domain.
 */
import { handleQuery } from "@api/lib/handleQuery";
import { handleMutation } from "@api/lib/handleMutation";
import type { NotificationsQueryResponse } from "./types";

/**
 * Fetches a paginated list of notifications.
 * @param {object} params - Query parameters.
 * @param {number} params.page - The page number to fetch.
 * @param {number} [params.limit] - The number of items per page.
 * @returns {Promise<NotificationsQueryResponse>} A promise that resolves with the notifications data.
 */
const query = (params: { page: number; limit?: number }): Promise<NotificationsQueryResponse> => {
  return handleQuery<NotificationsQueryResponse>('/notifications', { params });
};

/**
 * Marks a single notification as read.
 * @param {string} id - The ID of the notification to mark as read.
 * @returns {Promise<null>} A promise that resolves when the notification is successfully marked as read.
 */
const markAsRead = (id: string): Promise<null> => {
  return handleMutation.patch(`/notifications/${id}/read`, {});
};

/**
 * Marks all notifications as read for the current user.
 * @returns {Promise<null>} A promise that resolves when all notifications are successfully marked as read.
 */
const markAllAsRead = (): Promise<null> => {
  return handleMutation.patch("/notifications/read-all", {});
};

export const notifications = {
  query,
  markAsRead,
  markAllAsRead,
};
