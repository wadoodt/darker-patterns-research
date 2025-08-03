/**
 * @file Custom React hooks for the Notifications domain.
 */
import { useAsyncCache } from "@hooks/useAsyncCache";
import { notifications } from "./";
import { CACHE_TTL } from "@lib/cache/constants";
import { cacheKeys } from "@api/cacheKeys";
import { useCache } from "@contexts/CacheContext";

export const useNotificationsQuery = (
  { page = 1, limit = 10 }: { page?: number; limit?: number } = {},
  options?: { enabled?: boolean }
) => {
  return useAsyncCache(
    cacheKeys.notifications.all(page, limit),
    () => notifications.query({ page, limit }),
    {
      ttl: CACHE_TTL.SESSION,
      ...options,
    }
  );
};

export const useMarkAsRead = () => {
  const { invalidateCacheKeys } = useCache();
  return {
    mutate: async (id: string) => {
      const result = await notifications.markAsRead(id);
      await invalidateCacheKeys(cacheKeys.notifications.allPrefix);
      return result;
    },
  };
};

export const useMarkAllAsRead = () => {
  const { invalidateCacheKeys } = useCache();
  return {
    mutate: async () => {
      const result = await notifications.markAllAsRead();
      await invalidateCacheKeys(cacheKeys.notifications.allPrefix);
      return result;
    },
  };
};
