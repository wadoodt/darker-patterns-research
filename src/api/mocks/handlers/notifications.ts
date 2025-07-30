import { db } from "../db";
import { getAuthenticatedUser, handleUnauthorized } from "../authUtils";
import { createPagedResponse } from "../utils/paged-response";
import { createSuccessResponse, createErrorResponse } from "../../response";

export const getNotifications = async (request: Request) => {
  try {
    const user = getAuthenticatedUser(request);
    if (!user) return handleUnauthorized();

    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const limit = parseInt(url.searchParams.get("limit") || "10", 10);

    const pagedResponse = createPagedResponse({
      table: "notifications",
      page,
      limit,
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });

    const response = createSuccessResponse(pagedResponse, "OPERATION_SUCCESS");
    return new Response(JSON.stringify(response), { status: 200 });
  } catch {
    const errorResponse = createErrorResponse("INTERNAL_SERVER_ERROR", {
      message: "Failed to fetch notifications",
    });
    return new Response(JSON.stringify(errorResponse), { status: 500 });
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
      const errorResponse = createErrorResponse("NOT_FOUND", {
        message: "Notification not found",
      });
      return new Response(JSON.stringify(errorResponse), { status: 404 });
    }

    const updated = db.notifications.update({
      where: { id: params.id },
      data: { read: true },
    });

    const response = createSuccessResponse(updated, "OPERATION_SUCCESS");
    return new Response(JSON.stringify(response), { status: 200 });
  } catch {
    const errorResponse = createErrorResponse("INTERNAL_SERVER_ERROR", {
      message: "Failed to mark notification as read",
    });
    return new Response(JSON.stringify(errorResponse), { status: 500 });
  }
};

export const markAllAsRead = async (request: Request) => {
  try {
    const user = getAuthenticatedUser(request);
    if (!user) return handleUnauthorized();

    const userNotifications = db.notifications.findMany({
      where: { userId: user.id },
      limit: Infinity,
    });

    userNotifications.forEach((notification) => {
      db.notifications.update({
        where: { id: notification.id },
        data: { read: true },
      });
    });

    const response = createSuccessResponse(
      { message: "All notifications marked as read" },
      "OPERATION_SUCCESS"
    );
    return new Response(JSON.stringify(response), { status: 200 });
  } catch {
    const errorResponse = createErrorResponse("INTERNAL_SERVER_ERROR", {
      message: "Failed to mark all notifications as read",
    });
    return new Response(JSON.stringify(errorResponse), { status: 500 });
  }
};
