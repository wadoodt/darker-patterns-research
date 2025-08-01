
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminTickets, useUpdateAdminTicket } from "@api/domains/admin/hooks";
import type { SupportTicket } from "@api/domains/support/types";

export function useTicketsPage() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const { data: ticketsData, loading: isLoading, error, refresh: refetch } = useAdminTickets(currentPage);
  const { mutate: updateTicket } = useUpdateAdminTicket();

  const handleStatusChange = async (
    ticketId: string,
    status: "open" | "in_progress" | "closed",
  ) => {
    updateTicket(ticketId, { status });
  };

  const tickets: SupportTicket[] = ticketsData?.tickets || [];
  const totalPages = ticketsData?.totalPages || 1;
  const errorMessage = error ? "Failed to load tickets" : null;

  return {
    navigate,
    currentPage,
    setCurrentPage,
    tickets,
    totalPages,
    isLoading,
    error: errorMessage,
    errorMessage,
    refresh: refetch,
    handleStatusChange,
  };
}
