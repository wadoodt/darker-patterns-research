import { db } from "../db";
import { createErrorResponse, createSuccessResponse } from "../../response";
import { ERROR_CODES, RESPONSE_CODES } from "../../codes";
import type { User, Company } from "types/api";
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
      const errorResponse = createErrorResponse("INVALID_CREDENTIALS");
      return new Response(JSON.stringify(errorResponse), {
        status: ERROR_CODES.INVALID_CREDENTIALS.status,
      });
    }

    const company = db.companies.findFirst({ where: { id: user.companyId } });

    if (!company || company.status !== "active") {
      const errorResponse = createErrorResponse("FORBIDDEN", {
        detail: "Company account is not active.",
      });
      return new Response(JSON.stringify(errorResponse), {
        status: ERROR_CODES.FORBIDDEN.status,
      });
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

    const successResponse = createSuccessResponse(
      {
        user: userResponse,
        token,
        refreshToken,
        expiresIn: 86400,
        notifications: {
          unread: unreadNotifications,
          unreadCount,
          total: totalNotifications,
        },
      },
      "LOGIN_SUCCESS",
    );

    return new Response(JSON.stringify(successResponse), {
      status: RESPONSE_CODES.LOGIN_SUCCESS.status,
    });
  } catch {
    const errorResponse = createErrorResponse("INTERNAL_SERVER_ERROR");
    return new Response(JSON.stringify(errorResponse), {
      status: ERROR_CODES.INTERNAL_SERVER_ERROR.status,
    });
  }
};

export const refreshToken = async (request: Request): Promise<Response> => {
  try {
    const { refreshToken } = (await request.json()) as { refreshToken: string };

    if (
      !refreshToken ||
      !refreshToken.startsWith("mock-refresh-token-for-id-")
    ) {
      const errorResponse = createErrorResponse("UNAUTHORIZED", {
        detail: "Invalid refresh token",
      });
      return new Response(JSON.stringify(errorResponse), {
        status: 401,
      });
    }

    const userId = refreshToken.replace("mock-refresh-token-for-id-", "");
    const user = db.users.findFirst({ where: { id: userId } });

    if (!user) {
      const errorResponse = createErrorResponse("NOT_FOUND", {
        detail: "User for refresh token not found",
      });
      return new Response(JSON.stringify(errorResponse), {
        status: 404,
      });
    }

    const newAccessToken = `mock-token-for-id-${user.id}`;
    const newRefreshToken = `mock-refresh-token-for-id-${user.id}`;

    const successResponse = createSuccessResponse(
      {
        token: newAccessToken,
        refreshToken: newRefreshToken,
        expiresIn: 86400,
      },
      "OPERATION_SUCCESS",
    );

    return new Response(JSON.stringify(successResponse), {
      status: 200,
    });
  } catch {
    const errorResponse = createErrorResponse("INTERNAL_SERVER_ERROR");
    return new Response(JSON.stringify(errorResponse), {
      status: 500,
    });
  }
};

/**
 * Handles the logout request using the standardized API response format.
 */
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
        return new Response(
          JSON.stringify(
            createErrorResponse("VALIDATION_ERROR", {
              error: validationError,
            }),
          ),
          {
            status: ERROR_CODES.VALIDATION_ERROR.status,
          },
        );
      }
      const { responseData } = createCompanyAndAdminUser(body);
      const successResponse = createSuccessResponse(
        responseData,
        "SIGNUP_SUCCESS",
      );
      return new Response(JSON.stringify(successResponse), {
        status: RESPONSE_CODES.SIGNUP_SUCCESS.status,
      });
    } else if (action === "join") {
      const validationError = validateJoinPayload(body);
      if (validationError) {
        return new Response(
          JSON.stringify(
            createErrorResponse("VALIDATION_ERROR", {
              error: validationError,
            }),
          ),
          {
            status: ERROR_CODES.VALIDATION_ERROR.status,
          },
        );
      }
      const company = findActiveCompanyById(body.companyId!);
      if (!company) {
        return new Response(
          JSON.stringify(
            createErrorResponse("NOT_FOUND", {
              detail:
                "The specified Company ID is invalid or the company is not active.",
            }),
          ),
          {
            status: ERROR_CODES.NOT_FOUND.status,
          },
        );
      }
      createUserForCompany(body);
      const successResponse = createSuccessResponse({}, "SIGNUP_SUCCESS");
      return new Response(JSON.stringify(successResponse), {
        status: RESPONSE_CODES.SIGNUP_SUCCESS.status,
      });
    } else {
      return new Response(
        JSON.stringify(
          createErrorResponse("VALIDATION_ERROR", {
            error: "Invalid signup action specified",
          }),
        ),
        {
          status: ERROR_CODES.VALIDATION_ERROR.status,
        },
      );
    }
  } catch {
    const errorResponse = createErrorResponse("INTERNAL_SERVER_ERROR");
    return new Response(JSON.stringify(errorResponse), {
      status: ERROR_CODES.INTERNAL_SERVER_ERROR.status,
    });
  }
};

export const logout = async (): Promise<Response> => {
  const successResponse = createSuccessResponse(null, "OPERATION_SUCCESS");
  return new Response(JSON.stringify(successResponse), {
    status: RESPONSE_CODES.OPERATION_SUCCESS.status,
  });
};
