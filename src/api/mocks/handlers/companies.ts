// src/api/mocks/companies-handler.ts
import { createSuccessResponse } from "../../response";
import { db } from "../db";
import { RESPONSE_CODES } from "../../codes";

/**
 * Handles the GET /api/companies request.
 * @returns A Response object with the list of companies.
 */
export async function getCompanies() {
  const companies = db.companies.findMany({});
  return new Response(
    JSON.stringify(createSuccessResponse({ companies }, "OPERATION_SUCCESS")),
    {
      status: RESPONSE_CODES.OPERATION_SUCCESS.status,
    }
  );
}
