// src/api/mocks/companies-handler.ts
import { db } from '../db';

/**
 * Handles the GET /api/companies request.
 * @returns A Response object with the list of companies.
 */
export async function getCompanies() {
  const companies = db.companies.findMany({});
  return new Response(JSON.stringify(companies), {
    headers: { 'Content-Type': 'application/json' },
    status: 200,
  });
}
