import { db } from "../db";
import { createErrorResponse, createSuccessResponse } from "../../response";
import { ERROR_CODES } from "../../codes";
import type { User } from "types/api";

/**
 * Handles the request to get all users within the admin's company.
 */
export const getUsers = async (): Promise<Response> => {
  // MOCK: Simulate an authenticated admin user for authorization.
  // In a real app, this would come from the session/token.
  const mockAdminUser = db.users.findFirst({ where: { role: "admin" } });

  if (!mockAdminUser) {
    const errorResponse = createErrorResponse("UNAUTHORIZED", {
      detail: "No admin user found in mock DB.",
    });
    return new Response(JSON.stringify(errorResponse), {
      status: ERROR_CODES.UNAUTHORIZED.status,
    });
  }

  const usersInCompany = db.users.findMany({
    where: { companyId: mockAdminUser.companyId },
  });

  // Exclude password from the response
  const usersResponse = usersInCompany.map((user) => {
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
  const mockAdminUser = db.users.findFirst({ where: { role: "admin" } });
  if (!mockAdminUser) {
    const errorResponse = createErrorResponse("UNAUTHORIZED", {
      detail: "No admin user found in mock DB.",
    });
    return new Response(JSON.stringify(errorResponse), {
      status: ERROR_CODES.UNAUTHORIZED.status,
    });
  }

  const url = new URL(request.url);
  const userId = url.pathname.split("/").pop();
  const { role, status } = (await request.json()) as Partial<
    Pick<User, "role" | "status">
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

  // Authorization check: ensure the admin is updating a user in their own company
  if (userToUpdate.companyId !== mockAdminUser.companyId) {
    const errorResponse = createErrorResponse("FORBIDDEN", {
      detail: "You can only update users in your own company.",
    });
    return new Response(JSON.stringify(errorResponse), {
      status: ERROR_CODES.FORBIDDEN.status,
    });
  }

  const updatedUser = db.users.update({
    where: { id: userId },
    data: {
      ...(role && { role }),
      ...(status && { status }),
    },
  });

  if (!updatedUser) {
    // This case should theoretically not be reached if userToUpdate was found, but it's good practice
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
export const getSupportTickets = async (request: Request): Promise<Response> => {
  // MOCK: Simulate an authenticated admin user for authorization.
  const mockAdminUser = db.users.findFirst({ where: { role: "admin" } });

  if (!mockAdminUser) {
    const errorResponse = createErrorResponse("UNAUTHORIZED", {
      detail: "No admin user found in mock DB.",
    });
    return new Response(JSON.stringify(errorResponse), {
      status: ERROR_CODES.UNAUTHORIZED.status,
    });
  }

  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get('page') || '1', 10);
  const limit = parseInt(url.searchParams.get('limit') || '10', 10);

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
  const mockAdminUser = db.users.findFirst({ where: { role: "admin" } });
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
    status: 'open' | 'in_progress' | 'closed';
  };

  if (!ticketId) {
    const errorResponse = createErrorResponse("VALIDATION_ERROR", {
      error: "Ticket ID is missing from the URL.",
    });
    return new Response(JSON.stringify(errorResponse), {
      status: ERROR_CODES.VALIDATION_ERROR.status,
    });
  }

  const ticketToUpdate = db.supportTickets.findFirst({ where: { id: ticketId } });

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

  const response = createSuccessResponse({ ticket: updatedTicket }, "OPERATION_SUCCESS");
  return new Response(JSON.stringify(response));
};
