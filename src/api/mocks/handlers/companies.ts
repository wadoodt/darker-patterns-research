// src/api/mocks/companies-handler.ts
import { createPagedResponse } from "../utils/paged-response";

/**
 * Handles the GET /api/companies request.
 * @returns A Response object with the list of companies.
 */
export async function getCompanies(request: Request) {
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get("page") || "1", 10);
  const limit = parseInt(url.searchParams.get("limit") || "10", 10);

  return createPagedResponse({
    table: "companies",
    page,
    limit,
    domain: "companies",
  });
}
