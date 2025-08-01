/**
 * @file Support API Domain
 *
 * This file contains all the API methods for the support domain.
 * It is consumed by the main API index file and should not be used
 * directly by components.
 */
import apiClient from "@api/client";
import { handleQuery } from "@api/lib/handleQuery";
import { handleMutation } from "@api/lib/handleMutation";
import type { PaginatedTicketsResponse, SupportTicket, TicketMessage } from "./types";

/**
 * Fetches a single support ticket by its ID.
 *
 * @param id The ID of the ticket to fetch.
 * @returns A promise that resolves to the support ticket.
 */
const getTicket = (id: string): Promise<SupportTicket> => {
  return handleQuery(() => apiClient.get(`/support/tickets/${id}`));
};

/**
 * Fetches the current user's support tickets with pagination.
 *
 * @param page The page number to fetch.
 * @param limit The number of tickets per page.
 * @returns A promise that resolves to the paginated ticket response.
 */
const myTickets = (page: number, limit: number): Promise<PaginatedTicketsResponse> => {
  return handleQuery(() => apiClient.get(`/support/tickets?page=${page}&limit=${limit}`));
};

/**
 * Adds a reply to a support ticket.
 *
 * @param ticketId The ID of the ticket to reply to.
 * @param reply The reply content.
 * @returns A promise that resolves to the new ticket message.
 */

const replyToTicket = (ticketId: string, reply: { content: string }): Promise<TicketMessage> => {
  return handleMutation(() => apiClient.post(`/support/tickets/${ticketId}/reply`, reply));
};

export const support = {
  getTicket,
  myTickets,
  replyToTicket,
};
