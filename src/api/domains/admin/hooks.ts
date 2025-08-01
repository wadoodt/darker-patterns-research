
import { useAsyncCache } from "@hooks/useAsyncCache";
import { admin } from "./index";
import type { PlatformRole } from "@api/domains/users/types";

export const useAdminUsers = () => {
  return useAsyncCache(
    ["admin", "users"],
    () => admin.getUsers(),
    { ttl: 5 * 60 * 1000 } // 5 minutes
  );
};

export const useUpdateAdminUser = () => {
  const { refresh } = useAsyncCache(["admin", "users"], () => Promise.resolve({ users: [] }));
  
  return {
    mutate: async (userId: string, updates: { platformRole: PlatformRole }) => {
      const result = await admin.updateUser(userId, updates);
      await refresh();
      return result;
    },
    isLoading: false,
  };
};

export const useAdminTickets = (page: number = 1) => {
  return useAsyncCache(
    ["admin", "tickets", page],
    () => admin.getTickets(page),
    { ttl: 5 * 60 * 1000 } // 5 minutes
  );
};

export const useUpdateAdminTicket = () => {
  const { refresh } = useAsyncCache(["admin", "tickets"], () => Promise.resolve({ tickets: [], totalPages: 0 }));
  
  return {
    mutate: async (ticketId: string, updates: { status: string }) => {
      const result = await admin.updateTicket(ticketId, updates);
      await refresh();
      return result;
    },
    isLoading: false,
  };
};
