/**
 * @file Custom React hooks for the Notifications domain.
 */
import { useAsyncCache } from "@hooks/useAsyncCache";
import { notifications } from "./";
import { CACHE_TTL } from "@lib/cache/constants";

// Note: The key for the cache is an array that includes the page number.
// `useAsyncCache` will automatically re-fetch when this key changes.
export const useNotificationsQuery = (page: number, options?: { enabled?: boolean }) => {
  return useAsyncCache(
    ["notifications", page],
    () => notifications.query(page),
    {
      ttl: CACHE_TTL.SESSION,
      ...options,
    },
  );
};
