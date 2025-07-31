import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAsyncCache } from "@hooks/useAsyncCache";
import api from "@api/client";
import type { SupportTicket } from "types/support-ticket";
import { CACHE_TTL } from "@lib/cache/constants";

const fetchAdminTickets = async (page: number) => {
  const response = await api.get(`/admin/tickets?page=${page}&limit=10`);
  return response.data;
};

export function useTicketsPage() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const { data, loading, error, refresh } = useAsyncCache(
    ["admin-tickets", currentPage],
    () => fetchAdminTickets(currentPage),
    {
      ttl: CACHE_TTL.STANDARD_5_MIN,
    },
  );

  const handleStatusChange = async (
    ticketId: string,
    status: "open" | "in_progress" | "closed",
  ) => {
    try {
      await api.patch(`/admin/tickets/${ticketId}`, { status });
      refresh();
    } catch (err) {
      console.error("Failed to update ticket status", err);
    }
  };

  const tickets: SupportTicket[] = data?.data?.tickets || [];
  const pagination = data?.data?.pagination;
  const errorMessage = error ? "Failed to load tickets" : null;

  return {
    navigate,
    currentPage,
    setCurrentPage,
    data,
    loading,
    error,
    refresh,
    handleStatusChange,
    tickets,
    pagination,
    errorMessage,
  };
}
