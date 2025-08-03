// src/api/mocks/companies-handler.ts
import { createPaginatedResponse } from "../../response";
import { db } from "../db";

/**
 * Handles the GET /api/companies request.
 * @returns A Response object with the list of companies.
 */
export async function getCompanies(request: Request) {
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get("page") || "1", 10);
  const limit = parseInt(url.searchParams.get("limit") || "10", 10);

  const companies = db.companies.findMany({});
  const totalCompanies = companies.length;
  const totalPages = Math.ceil(totalCompanies / limit);
  const data = companies.slice((page - 1) * limit, page * limit);

  return createPaginatedResponse(
    "OPERATION_SUCCESS",
    "companies",
    data,
    page,
    totalPages,
    totalCompanies
  );
}
