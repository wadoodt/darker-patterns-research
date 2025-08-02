// src/api/mocks/companies-handler.ts
import { createSuccessResponse } from "../../response";
import { db } from "../db";

/**
 * Handles the GET /api/companies request.
 * @returns A Response object with the list of companies.
 */
export async function getCompanies() {
  const companies = db.companies.findMany({});
  return createSuccessResponse("OPERATION_SUCCESS", "companies", companies);
}
