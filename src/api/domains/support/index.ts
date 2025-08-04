/**
 * @file Support API Domain
 *
 * This file contains all the API methods for the support domain.
 * It is consumed by the main API index file and should not be used
 * directly by components.
 */
import { handleQuery } from "@api/lib/handleQuery";
import { handleMutation } from "@api/lib/handleMutation";
import type { PaginatedTicketsResponse, SupportTicket, TicketMessage } from "./types";

/**
 * Fetches a single support ticket by its ID.
 * @param {string} id - The ID of the ticket to fetch.
 * @returns {Promise<SupportTicket>} A promise that resolves with the support ticket data.
 */
const getTicket = (id: string): Promise<SupportTicket> => {
  return handleQuery<SupportTicket>(`/support/tickets/${id}`);
};

/**
 * Fetches the current user's support tickets with pagination.
 * @param {object} [params] - Optional query parameters.
 * @param {number} [params.page] - The page number to fetch.
 * @param {number} [params.limit] - The number of tickets per page.
 * @returns {Promise<PaginatedTicketsResponse>} A promise that resolves to the paginated ticket response.
 */
const myTickets = (params: { page?: number; limit?: number } = {}): Promise<PaginatedTicketsResponse> => {
  return handleQuery<PaginatedTicketsResponse>('/support/tickets', { params });
};

/**
 * Adds a reply to a support ticket.
 * @param {string} ticketId - The ID of the ticket to reply to.
 * @param {{ content: string }} reply - The reply content.
 * @returns {Promise<TicketMessage>} A promise that resolves to the new ticket message.
 */
const replyToTicket = (ticketId: string, reply: { content: string }): Promise<TicketMessage> => {
  return handleMutation.post(`/support/tickets/${ticketId}/reply`, reply);
};

export const support = {
  getTicket,
  myTickets,
  replyToTicket,
};
