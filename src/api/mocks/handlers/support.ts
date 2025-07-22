import { db } from "../db";
import { createSuccessResponse, createErrorResponse } from "../../response";
import { authorize } from "../utils/auth";
import type { SupportTicket } from "../../../types/support-ticket";

// Corresponds to GET /api/support/articles
export const getSupportArticles = async () => {
  const articles = db.supportArticles.findMany({});

  // Simulate network delay to make loading states visible
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return new Response(JSON.stringify(articles), {
    headers: { "Content-Type": "application/json" },
    status: 200,
  });
};

// Corresponds to POST /api/support/contact
export const createContactSubmission = async (request: Request) => {
  const submission = await request.json();

  // Basic validation
  if (!submission.name || !submission.email || !submission.message) {
    return new Response(
      JSON.stringify({ message: "Missing required fields" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  const newSubmission = db.contactSubmissions.create(submission);

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  return new Response(JSON.stringify(newSubmission), {
    status: 201, // Created
    headers: { "Content-Type": "application/json" },
  });
};

/**
 * Handles the request to get all support tickets for the authenticated user.
 */
export const getMyTickets = async (request: Request): Promise<Response> => {
  const [user, errorResponse] = await authorize(request);

  if (errorResponse) {
    return errorResponse;
  }

  // If there's no error, the user should be present.
  if (!user) {
    // This case should ideally not be reached if authorize is implemented correctly,
    // but it's good practice to handle it.
    return new Response(JSON.stringify({ message: "Authorization failed" }), {
      status: 401,
    });
  }

  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get("page") || "1", 10);
  const limit = parseInt(url.searchParams.get("limit") || "10", 10);

  const allUserTickets = db.supportTickets.findMany({
    where: {
      email: user.email,
    },
  });

  const totalTickets = allUserTickets.length;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const tickets = allUserTickets.slice(startIndex, endIndex);

  const response = createSuccessResponse(
    {
      tickets,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalTickets / limit),
        totalTickets,
      },
    },
    "OPERATION_SUCCESS"
  );

  return new Response(JSON.stringify(response));
};

// Corresponds to GET /api/support/tickets/:ticketId
export const getTicketById = async (
  request: Request,
  params: { ticketId: string }
) => {
  const [user, errorResponse] = await authorize(request);
  if (errorResponse) {
    return errorResponse;
  }

  const ticket = db.supportTickets.findFirst({
    where: { id: params.ticketId },
  });

  if (!ticket) {
    return new Response(JSON.stringify(createErrorResponse("NOT_FOUND")), {
      status: 404,
    });
  }

  // User must be admin or owner of the ticket
  if (
    !["admin", "super-admin", "qa"].includes(user?.role ?? "")
  ) {
    return new Response(JSON.stringify(createErrorResponse("FORBIDDEN")), {
      status: 403,
    });
  }

  return new Response(
    JSON.stringify(createSuccessResponse({ ticket }, "OPERATION_SUCCESS")),
    {
      headers: { "Content-Type": "application/json" },
    }
  );
};

// Corresponds to POST /api/support/tickets/:ticketId/reply
export const createTicketReply = async (
  request: Request,
  params: { ticketId: string }
) => {
  const [user, errorResponse] = await authorize(request);
  if (errorResponse) return errorResponse;

  const { content } = await request.json();
  if (!content) {
    return new Response(
      JSON.stringify(
        createErrorResponse("VALIDATION_ERROR", {
          content: "Reply content cannot be empty.",
        })
      ),
      { status: 422 }
    );
  }

  const ticket = db.supportTickets.findFirst({
    where: { id: params.ticketId },
  });

  if (!ticket) {
    return new Response(JSON.stringify(createErrorResponse("NOT_FOUND")), {
      status: 404,
    });
  }

  // User must be admin or owner of the ticket to reply
  if (user?.role !== "admin" && ticket.email !== user?.email) {
    return new Response(JSON.stringify(createErrorResponse("FORBIDDEN")), {
      status: 403,
    });
  }

  const newMessages = Array.isArray(ticket.messages) ? ticket.messages : [];

  const updatedTicket = db.supportTickets.update({
    where: { id: params.ticketId },
    data: {
      messages: [
        ...newMessages,
        {
          author: user?.role === "admin" ? "support" : "user",
          content,
          createdAt: new Date().toISOString(),
        },
      ],
      updatedAt: new Date().toISOString(),
      // Optionally re-open the ticket if a user replies to a closed one
      status:
        ticket.status === "closed" && user?.role !== "admin"
          ? "open"
          : ticket.status,
    } as Partial<SupportTicket>,
  });

  return new Response(
    JSON.stringify(
      createSuccessResponse({ ticket: updatedTicket }, "OPERATION_SUCCESS")
    )
  );
};
