// src/api/mocks/handlers/user-handler.ts
import { db } from "../db";
import { createErrorResponse, createSuccessResponse } from "../../response";
import type { User } from "@api/domains/users/types";

/**
 * Handles the GET /api/users/me request.
 */
export const getUserMe = async (request: Request): Promise<Response> => {
  try {
    const token = request.headers.get("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return createErrorResponse("UNAUTHORIZED", "No token provided");
    }

    const userId = token.replace("mock-token-for-id-", "");
    const user = db.users.findFirst({ where: { id: userId } });

    if (!user) {
      return createErrorResponse("UNAUTHORIZED", "User not found");
    }

    const company = db.companies.findFirst({ where: { id: user.companyId } });

    // Fetch first 10 unread notifications
    const unreadNotifications = db.notifications.findMany({
      where: {
        userId: user.id,
        read: false,
      },
      limit: 10,
      orderBy: { createdAt: "desc" },
    });

    // The user object in the auth context needs the plan
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userResponse } = {
      ...user,
      plan: company?.plan,
      unreadNotifications,
    };

    return createSuccessResponse("OPERATION_SUCCESS", "user", userResponse);
  } catch {
    return createErrorResponse("INTERNAL_SERVER_ERROR", "Failed to fetch user");
  }
};

/**
 * Handles the PATCH /api/users/me request.
 */
export const updateUserMe = async (request: Request): Promise<Response> => {
  try {
    const token = request.headers.get("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return createErrorResponse("UNAUTHORIZED", "No token provided");
    }

    const userId = token.replace("mock-token-for-id-", "");
    const user = db.users.findFirst({ where: { id: userId } });

    if (!user) {
      return createErrorResponse("NOT_FOUND", "User not found");
    }

    const { name } = (await request.json()) as Pick<User, "name">;

    if (!name) {
      return createErrorResponse("VALIDATION_ERROR", "Name is required", { name: "Name is required" });
    }

    const updatedUser = db.users.update({
      where: { id: userId },
      data: { name },
    });

    if (!updatedUser) {
      return createErrorResponse("NOT_FOUND", "User not found");
    }

    const company = db.companies.findFirst({
      where: { id: updatedUser.companyId },
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userResponse } = {
      ...updatedUser,
      plan: company?.plan,
    };

    // Fetch first 10 unread notifications
    const unreadNotifications = db.notifications.findMany({
      where: {
        userId: updatedUser.id,
        read: false,
      },
      limit: 10,
      orderBy: { createdAt: "desc" },
    });

    return createSuccessResponse("OPERATION_SUCCESS", "user", { ...userResponse, unreadNotifications });
  } catch {
    return createErrorResponse("INTERNAL_SERVER_ERROR", "Failed to update user");
  }
};
