
import { handleQuery } from "@api/lib/handleQuery";
import type { CompaniesResponse } from "./types";

/**
 * Fetches a paginated list of companies.
 * @param {object} [params] - Optional query parameters.
 * @param {number} [params.page] - The page number to fetch.
 * @param {number} [params.limit] - The number of items per page.
 * @returns {Promise<CompaniesResponse>} A promise that resolves with the companies data.
 */
const getCompanies = (params: { page?: number; limit?: number } = {}): Promise<CompaniesResponse> => {
  return handleQuery<CompaniesResponse>("/companies", { params });
};

export const companies = {
  getCompanies,
}; 