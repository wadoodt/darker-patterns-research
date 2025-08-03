
import { useAsyncCache } from "@hooks/useAsyncCache";
import { support } from "./index";
import { cacheKeys } from "@api/cacheKeys";
import { useCache } from "@contexts/CacheContext";
import { useState } from "react";

const SUPPORT_CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export const useMyTickets = ({ page = 1, limit = 10 }) => {
  return useAsyncCache(
    cacheKeys.support.all(page, limit),
    () => support.myTickets({ page, limit }),
    { ttl: SUPPORT_CACHE_TTL }
  );
};

export const useTicket = (ticketId: string) => {
  return useAsyncCache(
    cacheKeys.support.one(ticketId),
    () => support.getTicket(ticketId),
    { ttl: SUPPORT_CACHE_TTL }
  );
};

export const useReplyToTicket = () => {
  const { invalidateCacheKeys } = useCache();
  const [isLoading, setIsLoading] = useState(false);

  return {
    mutate: async (ticketId: string, reply: { content: string }) => {
      setIsLoading(true);
      try {
        const result = await support.replyToTicket(ticketId, reply);
        await invalidateCacheKeys(cacheKeys.support.allPrefix);
        return result;
      } finally {
        setIsLoading(false);
      }
    },
    isLoading,
  };
};
