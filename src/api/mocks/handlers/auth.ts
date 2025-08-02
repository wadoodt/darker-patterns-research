import { db } from "../db";
import { createErrorResponse, createSuccessResponse } from "../../response";
import type { User } from "@api/domains/users/types";
import type { Company } from "types";
import type { Notification } from "@api/domains/notifications/types";
import { mockNotifications } from "../data/notifications";
import {
  validateCreatePayload,
  validateJoinPayload,
  createCompanyAndAdminUser,
  createUserForCompany,
  findActiveCompanyById,
} from "./authUtils";

type SignupPayload = Partial<User> &
  Partial<Pick<Company, "name" | "plan">> & {
    action: "create" | "join";
    companyName?: string;
  };

/**
 * Handles the login request using the standardized API response format.
 */
export const login = async (request: Request): Promise<Response> => {
  try {
    const { username, password } = (await request.json()) as Pick<
      User,
      "username" | "password"
    >;
    const user = db.users.findFirst({ where: { username } });

    if (!user || user.password !== password) {
      return createErrorResponse("INVALID_CREDENTIALS", "Invalid credentials");
    }

    const company = db.companies.findFirst({ where: { id: user.companyId } });

    if (!company || company.status !== "active") {
      return createErrorResponse("FORBIDDEN", "Company account is not active.");
    }

    // Get user's notifications
    const allNotifications: Notification[] = mockNotifications.filter(
      (n: Notification) => n.userId === user.id
    );
    const unreadNotifications = allNotifications
      .filter((n) => !n.read)
      .slice(0, 10);
    const unreadCount = unreadNotifications.length;
    const totalNotifications = allNotifications.length;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _password, ...userResponse } = {
      ...user,
      plan: company.plan,
    };
    const token = `mock-token-for-id-${user.id}`;
    const refreshToken = `mock-refresh-token-for-id-${user.id}`;

    return createSuccessResponse("LOGIN_SUCCESS", "auth", {
      user: userResponse,
      token,
      refreshToken,
      expiresIn: 86400,
      notifications: {
        unread: unreadNotifications,
        unreadCount,
        total: totalNotifications,
      },
    });
  } catch {
    return createErrorResponse("INTERNAL_SERVER_ERROR", "Failed to login");
  }
};

export const refreshToken = async (request: Request): Promise<Response> => {
  try {
    const { refreshToken } = (await request.json()) as { refreshToken: string };

    if (!refreshToken || !refreshToken.startsWith("mock-refresh-token-for-id-")) {
      return createErrorResponse("UNAUTHORIZED", "Invalid refresh token");
    }

    const userId = refreshToken.replace("mock-refresh-token-for-id-", "");
    const user = db.users.findFirst({ where: { id: userId } });

    if (!user) {
      return createErrorResponse("NOT_FOUND", "User for refresh token not found");
    }

    const newAccessToken = `mock-token-for-id-${user.id}`;
    const newRefreshToken = `mock-refresh-token-for-id-${user.id}`;

    return createSuccessResponse("OPERATION_SUCCESS", "auth", {
      token: newAccessToken,
      refreshToken: newRefreshToken,
      expiresIn: 86400,
    });
  } catch {
    return createErrorResponse("INTERNAL_SERVER_ERROR", "Failed to refresh token");
  }
};

/**
 * Handles the signup request.
 */
export const signup = async (request: Request): Promise<Response> => {
  try {
    const body = (await request.json()) as SignupPayload;
    const { action } = body;

    if (action === "create") {
      const validationError = validateCreatePayload(body);
      if (validationError) {
        return createErrorResponse("VALIDATION_ERROR", validationError);
      }
      const { responseData } = createCompanyAndAdminUser(body);
      return createSuccessResponse("SIGNUP_SUCCESS", "auth", responseData);
    } else if (action === "join") {
      const validationError = validateJoinPayload(body);
      if (validationError) {
        return createErrorResponse("VALIDATION_ERROR", validationError);
      }
      const company = findActiveCompanyById(body.companyId!);
      if (!company) {
        return createErrorResponse("NOT_FOUND", "The specified Company ID is invalid or the company is not active.");
      }
      createUserForCompany(body);
      return createSuccessResponse("SIGNUP_SUCCESS", "auth", {});
    } else {
      return createErrorResponse("VALIDATION_ERROR", "Invalid signup action specified");
    }
  } catch {
    return createErrorResponse("INTERNAL_SERVER_ERROR", "Failed to signup");
  }
};

export const logout = async (): Promise<Response> => {
  return createSuccessResponse("OPERATION_SUCCESS", "auth", null);
};
