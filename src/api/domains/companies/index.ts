
import apiClient from "@api/client";
import { handleQuery } from "@api/lib/handleQuery";
import type { CompaniesResponse } from "./types";

const getCompanies = async (): Promise<CompaniesResponse> => {
  return handleQuery(() => apiClient.get("/companies"));
};

export const companies = {
  getCompanies,
}; 