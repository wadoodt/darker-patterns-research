import { db } from "../db";
import { createSuccessResponse, createErrorResponse } from "../../response";
import { getAuthenticatedUser, handleUnauthorized } from "../authUtils";
import { createPagedResponse } from "../utils/paged-response";

export const createContactSubmission = async (request: Request) => {
  const body = await request.json();
  db.contactSubmissions.create(body);
  return createSuccessResponse("OPERATION_SUCCESS", "support", { message: "Submission received" });
};

export const getMyTickets = async (request: Request) => {
  try {
    const user = getAuthenticatedUser(request);
    if (!user) return handleUnauthorized();

    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const limit = parseInt(url.searchParams.get("limit") || "10", 10);

    return createPagedResponse({
      table: "supportTickets",
      page,
      limit,
      domain: "supportTickets",
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });
  } catch {
    return createErrorResponse("INTERNAL_SERVER_ERROR", "Failed to fetch tickets");
  }
};

export const getTicketById = async (
  _request: Request,
  { ticketId }: { ticketId: string },
) => {
  const ticket = db.supportTickets.findFirst({ where: { id: ticketId } });
  if (!ticket) {
    return createErrorResponse("NOT_FOUND", "Ticket not found");
  }
  return createSuccessResponse("OPERATION_SUCCESS", "supportTicket", ticket);
};

export const createTicketReply = async (
  request: Request,
  { ticketId }: { ticketId: string },
) => {
  const body = await request.json();
  const ticket = db.supportTickets.findFirst({ where: { id: ticketId } });

  if (!ticket) {
    return createErrorResponse("NOT_FOUND", "Ticket not found");
  }

  const updatedTicket = db.supportTickets.update({
    where: { id: ticketId },
    data: {
      messages: [
        ...ticket.messages,
        { ...body, createdAt: new Date().toISOString() },
      ],
      updatedAt: new Date().toISOString(),
    },
  });

  return createSuccessResponse("OPERATION_SUCCESS", "supportTicket", updatedTicket);
};
