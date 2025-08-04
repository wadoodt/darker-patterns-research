import { db } from "../db";
import { getAuthenticatedUser, handleUnauthorized } from "../authUtils";
import { createSuccessResponse, createErrorResponse } from "../../response";
import { createPagedResponse } from "../utils/paged-response";

export const getNotifications = async (request: Request) => {
  try {
    const user = getAuthenticatedUser(request);
    if (!user) return handleUnauthorized();

    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const limit = parseInt(url.searchParams.get("limit") || "10", 10);

    return createPagedResponse({
      table: "notifications",
      page,
      limit,
      domain: "notifications",
      orderBy: { createdAt: "desc" },
      where: { userId: user.id, read: false },
    });
  } catch {
    return createErrorResponse("INTERNAL_SERVER_ERROR", "Failed to fetch notifications");
  }
};

export const markAsRead = async (
  request: Request,
  params: { id: string }
) => {
  try {
    const user = getAuthenticatedUser(request);
    if (!user) return handleUnauthorized();

    const notification = db.notifications.findFirst({
      where: { id: params.id, userId: user.id },
    });

    if (!notification) {
      return createErrorResponse("NOT_FOUND", "Notification not found");
    }

    const updated = db.notifications.update({
      where: { id: params.id },
      data: { read: true },
    });

    return createSuccessResponse("OPERATION_SUCCESS", "notification", updated);
  } catch {
    return createErrorResponse("INTERNAL_SERVER_ERROR", "Failed to mark notification as read");
  }
};

export const markAllAsRead = async (request: Request) => {
  try {
    const user = getAuthenticatedUser(request);
    if (!user) return handleUnauthorized();

    const userNotifications = db.notifications.findMany({
      where: { userId: user.id },
    });

    userNotifications.forEach((notification) => {
      db.notifications.update({
        where: { id: notification.id },
        data: { read: true },
      });
    });

    return createSuccessResponse(
      "OPERATION_SUCCESS",
      "notifications",
      { message: "All notifications marked as read" }
    );
  } catch {
    return createErrorResponse("INTERNAL_SERVER_ERROR", "Failed to mark all notifications as read");
  }
};
