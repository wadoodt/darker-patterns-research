
import apiClient from "@api/client";
import { handleQuery } from "@api/lib/handleQuery";
import type { CompaniesResponse } from "./types";

const getCompanies = async (params: { page?: number; limit?: number } = {}): Promise<CompaniesResponse> => {
  return handleQuery(() => apiClient.get("/companies", { params }));
};

export const companies = {
  getCompanies,
}; 