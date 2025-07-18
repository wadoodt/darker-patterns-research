// src/components/CompaniesList.tsx
"use client";

import apiClient from "@api/client";
import { useAsyncCache } from "@hooks/useAsyncCache";
import { CacheLevel } from "@lib/cache/types";
import * as api from "types/api";

// This is the new data fetching function that uses the standard fetch API.
// Our mock resolver will intercept this call.
async function fetchCompanies() {
  const response = await apiClient.get("/companies");
  if (response.status !== 200) {
    throw new Error("Failed to fetch companies");
  }
  return response.data;
}

export function CompaniesList() {
  const {
    data: companies,
    loading,
    error,
    refresh,
  } = useAsyncCache<api.Company[]>(
    ["companies"], // Cache key
    fetchCompanies, // Use the new fetcher function
    CacheLevel.PERSISTENT,
  );

  if (loading && !companies) return <div>Loading companies...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div
      style={{ border: "1px solid #ccc", borderRadius: "8px", padding: "16px" }}
    >
      <h3
        style={{
          marginBottom: "12px",
          fontSize: "1.125rem",
          fontWeight: "600",
        }}
      >
        Registered Companies
      </h3>
      <button
        onClick={refresh}
        style={{
          marginBottom: "1rem",
          padding: "4px 8px",
          borderRadius: "4px",
        }}
      >
        Refresh List
      </button>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {companies?.map((company) => (
          <li
            key={company.id}
            style={{ padding: "8px 0", borderBottom: "1px solid #eee" }}
          >
            <strong>{company.name}</strong> - Plan: {company.plan}
          </li>
        ))}
      </ul>
    </div>
  );
}
