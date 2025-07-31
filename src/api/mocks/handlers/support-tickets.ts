import { db } from "../db";
import { createSuccessResponse, createErrorResponse } from "../../response";
import { createPagedResponse } from "../utils/paged-response";
import { getAuthenticatedUser, handleUnauthorized } from "../authUtils";

export const createContactSubmission = async (request: Request) => {
  const body = await request.json();
  db.contactSubmissions.create(body);
  return new Response(JSON.stringify({ message: "Submission received" }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};

export const getMyTickets = async (request: Request) => {
  try {
    const user = getAuthenticatedUser(request);
    if (!user) return handleUnauthorized();

    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const limit = parseInt(url.searchParams.get("limit") || "10", 10);

    const pagedResponse = createPagedResponse({
      table: "supportTickets",
      page,
      limit,
      orderBy: { createdAt: "desc" },
    });

    console.log("pagedResponse", pagedResponse);

    if (pagedResponse.data?.length === 0) {
      const emptyResponse = createSuccessResponse(pagedResponse, "NO_DATA");
      return new Response(JSON.stringify(emptyResponse), { status: 200 });
    }

    const response = createSuccessResponse(pagedResponse, "OPERATION_SUCCESS");
    return new Response(JSON.stringify(response), { status: 200 });
  } catch {
    const errorResponse = createErrorResponse("INTERNAL_SERVER_ERROR", {
      message: "Failed to fetch tickets",
    });
    return new Response(JSON.stringify(errorResponse), { status: 500 });
  }
};

export const getTicketById = async (
  _request: Request,
  { ticketId }: { ticketId: string },
) => {
  const ticket = db.supportTickets.findFirst({ where: { id: ticketId } });
  if (!ticket) {
    return new Response("Ticket not found", { status: 404 });
  }
  return new Response(JSON.stringify(ticket), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};

export const createTicketReply = async (
  request: Request,
  { ticketId }: { ticketId: string },
) => {
  const body = await request.json();
  const ticket = db.supportTickets.findFirst({ where: { id: ticketId } });

  if (!ticket) {
    return new Response("Ticket not found", { status: 404 });
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

  return new Response(JSON.stringify(updatedTicket), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};
