"use client";

import { useCompanies } from "@api/domains/companies/hooks";

export function CompaniesList() {
  const { data: companiesData, loading: isLoading, error, refresh: refetch } = useCompanies({});

  if (isLoading && !companiesData) return <div>Loading companies...</div>;
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
        onClick={() => refetch()}
        style={{
          marginBottom: "1rem",
          padding: "4px 8px",
          borderRadius: "4px",
        }}
      >
        Refresh List
      </button>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {companiesData?.companies.map((company) => (
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
