
import { useAsyncCache } from "@hooks/useAsyncCache";
import { admin } from "./index";
import type { PlatformRole } from "@api/domains/users/types";
import { cacheKeys } from "@api/cacheKeys";
import { useCache } from "@contexts/CacheContext";
import { useState } from "react";

const ADMIN_CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export const useAdminUsers = ({ page = 1, limit = 10 }) => {
  return useAsyncCache(
    cacheKeys.admin.users(page, limit),
    () => admin.getUsers({ page, limit }),
    { ttl: ADMIN_CACHE_TTL }
  );
};

export const useUpdateAdminUser = () => {
  const { invalidateCacheKeys } = useCache();

  return {
    mutate: async (userId: string, updates: { platformRole: PlatformRole }) => {
      const result = await admin.updateUser(userId, updates);
      await invalidateCacheKeys(cacheKeys.admin.usersPrefix);
      await invalidateCacheKeys(cacheKeys.users.mePrefix);
      return result;
    },
  };
};

export const useAdminTickets = ({ page = 1, limit = 10 }) => {
  return useAsyncCache(
    cacheKeys.admin.tickets(page, limit),
    () => admin.getTickets({ page, limit }),
    { ttl: ADMIN_CACHE_TTL }
  );
};

export const useUpdateAdminTicket = () => {
  const { invalidateCacheKeys } = useCache();
  const [isLoading, setIsLoading] = useState(false);

  return {
    mutate: async (ticketId: string, updates: { status: string }) => {
      setIsLoading(true);
      try {
        const result = await admin.updateTicket(ticketId, updates);
        await invalidateCacheKeys(cacheKeys.admin.ticketsPrefix);
        return result;
      } finally {
        setIsLoading(false);
      }
    },
    isLoading,
  };
};
