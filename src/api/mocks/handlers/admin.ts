import { db } from "../db";
import { createErrorResponse, createSuccessResponse } from "../../response";
import { createPagedResponse } from "../utils/paged-response";
import type { User } from "@api/domains/users/types";

/**
 * Handles the request to get all users. 
 * If the requester is a super-admin, it returns all users.
 * Otherwise, it returns users from the requester's company.
 */
export const getUsers = async (request: Request): Promise<Response> => {
  // MOCK: Simulate an authenticated admin user for authorization.
  const mockAdminUser = db.users.findFirst({ where: { platformRole: "super-admin" } });

  if (!mockAdminUser) {
    return createErrorResponse("UNAUTHORIZED", "No admin user found in mock DB for this operation.");
  }

  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get("page") || "1", 10);
  const limit = parseInt(url.searchParams.get("limit") || "10", 10);

  const where = mockAdminUser.platformRole === 'super-admin' 
    ? {} 
    : { companyId: mockAdminUser.companyId };

  return createPagedResponse({
    table: "users",
    page,
    limit,
    domain: "users",
    where,
  });
};

/**
 * Handles the request to update a user's role or status.
 */
export const updateUser = async (request: Request): Promise<Response> => {
  // MOCK: For this operation, we need a super-admin.
  const mockAdminUser = db.users.findFirst({ where: { platformRole: "super-admin" } });
  if (!mockAdminUser || mockAdminUser.platformRole !== 'super-admin') {
    return createErrorResponse("FORBIDDEN", "This operation requires super-admin privileges.");
  }

  const url = new URL(request.url);
  const userId = url.pathname.split("/").pop();
  const { platformRole, status } = (await request.json()) as Partial<
    Pick<User, "platformRole" | "status">
  >;

  if (!userId) {
    return createErrorResponse("VALIDATION_ERROR", "User ID is missing from the URL.");
  }

  const userToUpdate = db.users.findFirst({ where: { id: userId } });

  if (!userToUpdate) {
    return createErrorResponse("NOT_FOUND", "User to update was not found.");
  }

  const updatedUser = db.users.update({
    where: { id: userId },
    data: {
      ...(platformRole && { platformRole }),
      ...(status && { status }),
    },
  });

  if (!updatedUser) {
    return createErrorResponse("INTERNAL_SERVER_ERROR", "Failed to update the user.");
  }

  // Exclude password from the response
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password, ...userResponse } = updatedUser;

  return createSuccessResponse("OPERATION_SUCCESS", "user", userResponse);
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
    return createErrorResponse("UNAUTHORIZED", "No admin user found in mock DB.");
  }

  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get("page") || "1", 10);
  const limit = parseInt(url.searchParams.get("limit") || "10", 10);

  return createPagedResponse({
    table: "supportTickets",
    page,
    limit,
    domain: "tickets",
  });
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
    return createErrorResponse("UNAUTHORIZED", "No admin user found in mock DB.");
  }

  const { ticketId } = params;
  const { status } = (await request.json()) as {
    status: "open" | "in_progress" | "closed";
  };

  if (!ticketId) {
    return createErrorResponse("VALIDATION_ERROR", "Ticket ID is missing from the URL.");
  }

  const ticketToUpdate = db.supportTickets.findFirst({
    where: { id: ticketId },
  });

  if (!ticketToUpdate) {
    return createErrorResponse("NOT_FOUND", "Ticket to update was not found.");
  }

  const updatedTicket = db.supportTickets.update({
    where: { id: ticketId },
    data: { status },
  });

  return createSuccessResponse("OPERATION_SUCCESS", "ticket", updatedTicket);
};
