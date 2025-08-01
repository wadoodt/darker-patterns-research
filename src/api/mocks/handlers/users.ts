// src/api/mocks/handlers/user-handler.ts
import { db } from "../db";
import { createErrorResponse, createSuccessResponse } from "../../response";
import { ERROR_CODES, RESPONSE_CODES } from "../../codes";
import type { User } from "@api/domains/users/types";

/**
 * Handles the GET /api/users/me request.
 */
export const getUserMe = async (request: Request): Promise<Response> => {
  try {
    const token = request.headers.get("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return new Response(JSON.stringify(createErrorResponse("UNAUTHORIZED")), {
        status: ERROR_CODES.UNAUTHORIZED.status,
      });
    }

    const userId = token.replace("mock-token-for-id-", "");
    const user = db.users.findFirst({ where: { id: userId } });

    if (!user) {
      return new Response(JSON.stringify(createErrorResponse("UNAUTHORIZED")), {
        status: ERROR_CODES.UNAUTHORIZED.status,
      });
    }

    const company = db.companies.findFirst({ where: { id: user.companyId } });

    // The user object in the auth context needs the plan
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userResponse } = {
      ...user,
      plan: company?.plan,
    };

    // Fetch first 10 unread notifications
    const unreadNotifications = db.notifications.findMany({
      where: { 
        userId: user.id,
        read: false 
      },
      limit: 10,
      orderBy: { createdAt: "desc" },
    });

    return new Response(
      JSON.stringify(
        createSuccessResponse({ 
          user: userResponse, 
          unreadNotifications 
        }, "OPERATION_SUCCESS"),
      ),
      {
        status: RESPONSE_CODES.OPERATION_SUCCESS.status,
      },
    );
  } catch {
    return new Response(
      JSON.stringify(createErrorResponse("INTERNAL_SERVER_ERROR")),
      {
        status: ERROR_CODES.INTERNAL_SERVER_ERROR.status,
      },
    );
  }
};

/**
 * Handles the PATCH /api/users/me request.
 */
export const updateUserMe = async (request: Request): Promise<Response> => {
  try {
    const token = request.headers.get("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return new Response(JSON.stringify(createErrorResponse("UNAUTHORIZED")), {
        status: ERROR_CODES.UNAUTHORIZED.status,
      });
    }

    const userId = token.replace("mock-token-for-id-", "");
    const user = db.users.findFirst({ where: { id: userId } });

    if (!user) {
      return new Response(JSON.stringify(createErrorResponse("NOT_FOUND")), {
        status: ERROR_CODES.NOT_FOUND.status,
      });
    }

    const { name } = (await request.json()) as Pick<User, "name">;

    if (!name) {
      return new Response(
        JSON.stringify(
          createErrorResponse("VALIDATION_ERROR", { name: "Name is required" }),
        ),
        {
          status: ERROR_CODES.VALIDATION_ERROR.status,
        },
      );
    }

    const updatedUser = db.users.update({
      where: { id: userId },
      data: { name },
    });

    if (!updatedUser) {
      return new Response(JSON.stringify(createErrorResponse("NOT_FOUND")), {
        status: ERROR_CODES.NOT_FOUND.status,
      });
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
        read: false 
      },
      limit: 10,
      orderBy: { createdAt: "desc" },
    });

    return new Response(
      JSON.stringify(
        createSuccessResponse({ 
          user: userResponse, 
          unreadNotifications 
        }, "OPERATION_SUCCESS"),
      ),
      {
        status: RESPONSE_CODES.OPERATION_SUCCESS.status,
      },
    );
  } catch {
    return new Response(
      JSON.stringify(createErrorResponse("INTERNAL_SERVER_ERROR")),
      {
        status: ERROR_CODES.INTERNAL_SERVER_ERROR.status,
      },
    );
  }
};
