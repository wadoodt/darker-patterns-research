
import apiClient from "@api/client";
import { handleQuery } from "@api/lib/handleQuery";
import { handleMutation } from "@api/lib/handleMutation";
import type { User } from "@api/domains/users/types";
import type { SupportTicket } from "@api/domains/support/types";
import type { PlatformRole } from "@api/domains/users/types";

const getUsers = async (): Promise<{ users: User[] }> => {
  return handleQuery(() => apiClient.get("/admin/users"));
};

const updateUser = async (userId: string, updates: { platformRole: PlatformRole }): Promise<User> => {
  return handleMutation(() => apiClient.patch(`/admin/users/${userId}`, updates));
};

const getTickets = async (page: number): Promise<{ tickets: SupportTicket[], totalPages: number }> => {
  return handleQuery(() => apiClient.get(`/admin/tickets?page=${page}&limit=10`));
};

const updateTicket = async (ticketId: string, updates: { status: string }): Promise<SupportTicket> => {
  return handleMutation(() => apiClient.patch(`/admin/tickets/${ticketId}`, updates));
};

export const admin = {
  getUsers,
  updateUser,
  getTickets,
  updateTicket,
};
