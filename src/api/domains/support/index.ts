/**
 * @file Support API Domain
 *
 * This file contains all the API methods for the support domain.
 * It is consumed by the main API index file and should not be used
 * directly by components.
 */
import apiClient from "@api/client";
import { handleQuery } from "@api/lib/handleQuery";
import type { PaginatedTicketsResponse } from "types/support-ticket";

/**
 * Fetches the current user's support tickets with pagination.
 *
 * @param page The page number to fetch.
 * @param limit The number of tickets per page.
 * @returns A promise that resolves to the paginated ticket response.
 */
const myTickets = (page: number, limit: number): Promise<PaginatedTicketsResponse> => {
  return handleQuery(() => apiClient.get(`/support/my-tickets?page=${page}&limit=${limit}`));
};

export const support = {
  myTickets,
}; 