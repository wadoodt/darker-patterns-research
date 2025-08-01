import { db } from "../db";
import { createErrorResponse, createSuccessResponse } from "../../response";
import { ERROR_CODES } from "../../codes";
import type { User } from "@api/domains/users/types";

/**
 * Handles the request to get all users. 
 * If the requester is a super-admin, it returns all users.
 * Otherwise, it returns users from the requester's company.
 */
export const getUsers = async (): Promise<Response> => {
  // MOCK: Simulate an authenticated admin user for authorization.
  const mockAdminUser = db.users.findFirst({ where: { platformRole: "super-admin" } });

  if (!mockAdminUser) {
    const errorResponse = createErrorResponse("UNAUTHORIZED", {
      detail: "No admin user found in mock DB for this operation.",
    });
    return new Response(JSON.stringify(errorResponse), {
      status: ERROR_CODES.UNAUTHORIZED.status,
    });
  }

  let users;
  if (mockAdminUser.platformRole === 'super-admin') {
    // Super admin gets all users
    users = db.users.findMany({});
  } else {
    // Company admin gets users from their own company
    users = db.users.findMany({
      where: { companyId: mockAdminUser.companyId },
    });
  }

  // Exclude password from the response
  const usersResponse = users.map((user) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...rest } = user;
    return rest;
  });

  const response = createSuccessResponse(
    { users: usersResponse },
    "OPERATION_SUCCESS",
  );
  return new Response(JSON.stringify(response));
};

/**
 * Handles the request to update a user's role or status.
 */
export const updateUser = async (request: Request): Promise<Response> => {
  // MOCK: For this operation, we need a super-admin.
  const mockAdminUser = db.users.findFirst({ where: { platformRole: "super-admin" } });
  if (!mockAdminUser || mockAdminUser.platformRole !== 'super-admin') {
    const errorResponse = createErrorResponse("FORBIDDEN", {
      detail: "This operation requires super-admin privileges.",
    });
    return new Response(JSON.stringify(errorResponse), {
      status: ERROR_CODES.FORBIDDEN.status,
    });
  }

  const url = new URL(request.url);
  const userId = url.pathname.split("/").pop();
  const { platformRole, status } = (await request.json()) as Partial<
    Pick<User, "platformRole" | "status">
  >;

  if (!userId) {
    const errorResponse = createErrorResponse("VALIDATION_ERROR", {
      error: "User ID is missing from the URL.",
    });
    return new Response(JSON.stringify(errorResponse), {
      status: ERROR_CODES.VALIDATION_ERROR.status,
    });
  }

  const userToUpdate = db.users.findFirst({ where: { id: userId } });

  if (!userToUpdate) {
    const errorResponse = createErrorResponse("NOT_FOUND", {
      detail: "User to update was not found.",
    });
    return new Response(JSON.stringify(errorResponse), {
      status: ERROR_CODES.NOT_FOUND.status,
    });
  }

  const updatedUser = db.users.update({
    where: { id: userId },
    data: {
      ...(platformRole && { platformRole }),
      ...(status && { status }),
    },
  });

  if (!updatedUser) {
    const errorResponse = createErrorResponse("INTERNAL_SERVER_ERROR", {
      detail: "Failed to update the user.",
    });
    return new Response(JSON.stringify(errorResponse), {
      status: ERROR_CODES.INTERNAL_SERVER_ERROR.status,
    });
  }

  // Exclude password from the response
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password, ...userResponse } = updatedUser;

  const response = createSuccessResponse(userResponse, "OPERATION_SUCCESS");
  return new Response(JSON.stringify(response));
};

/**
 * Handles the request to get all support tickets.
 */
export const getSupportTickets = async (
  request: Request,
): Promise<Response> => {
  // MOCK: Simulate an authenticated admin user for authorization.
  const mockAdminUser = db.users.findFirst({ where: { platformRole: "super-admin" } });

  if (!mockAdminUser) {
    const errorResponse = createErrorResponse("UNAUTHORIZED", {
      detail: "No admin user found in mock DB.",
    });
    return new Response(JSON.stringify(errorResponse), {
      status: ERROR_CODES.UNAUTHORIZED.status,
    });
  }

  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get("page") || "1", 10);
  const limit = parseInt(url.searchParams.get("limit") || "10", 10);

  const allTickets = db.supportTickets.findMany({});
  const totalTickets = allTickets.length;

  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const tickets = allTickets.slice(startIndex, endIndex);

  const response = createSuccessResponse(
    {
      tickets,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalTickets / limit),
        totalTickets,
      },
    },
    "OPERATION_SUCCESS",
  );
  return new Response(JSON.stringify(response));
};

/**
 * Handles the request to update a support ticket's status.
 */
export const updateTicketStatus = async (
  request: Request,
  params: { ticketId: string },
): Promise<Response> => {
  const mockAdminUser = db.users.findFirst({ where: { platformRole: "super-admin" } });
  if (!mockAdminUser) {
    const errorResponse = createErrorResponse("UNAUTHORIZED", {
      detail: "No admin user found in mock DB.",
    });
    return new Response(JSON.stringify(errorResponse), {
      status: ERROR_CODES.UNAUTHORIZED.status,
    });
  }

  const { ticketId } = params;
  const { status } = (await request.json()) as {
    status: "open" | "in_progress" | "closed";
  };

  if (!ticketId) {
    const errorResponse = createErrorResponse("VALIDATION_ERROR", {
      error: "Ticket ID is missing from the URL.",
    });
    return new Response(JSON.stringify(errorResponse), {
      status: ERROR_CODES.VALIDATION_ERROR.status,
    });
  }

  const ticketToUpdate = db.supportTickets.findFirst({
    where: { id: ticketId },
  });

  if (!ticketToUpdate) {
    const errorResponse = createErrorResponse("NOT_FOUND", {
      detail: "Ticket to update was not found.",
    });
    return new Response(JSON.stringify(errorResponse), {
      status: ERROR_CODES.NOT_FOUND.status,
    });
  }

  const updatedTicket = db.supportTickets.update({
    where: { id: ticketId },
    data: { status },
  });

  const response = createSuccessResponse(
    { ticket: updatedTicket },
    "OPERATION_SUCCESS",
  );
  return new Response(JSON.stringify(response));
};
