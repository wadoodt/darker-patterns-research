
import { useMemo } from "react";
import { useAsyncCache } from "@hooks/useAsyncCache";
import { users } from "./index";
import type { UpdateUserPayload } from "./types";
import { getAccessToken, getExpiresAt } from "@lib/tokenService";

export const useUser = () => {
  const authToken = getAccessToken();
  const tokenExpiresAt = getExpiresAt();
  
  // Calculate TTL based on token expiration
  const ttl = useMemo(() => {
    const defaultTtl = 5 * 60 * 1000; // Default 5 minutes
    if (tokenExpiresAt) {
      const now = Date.now();
      const timeUntilExpiry = tokenExpiresAt - now;
      
      // Set TTL to 90% of time until expiry, with a minimum of 1 minute
      if (timeUntilExpiry > 0) {
        return Math.max(timeUntilExpiry * 0.9, 60 * 1000);
      }
    }
    return defaultTtl;
  }, [tokenExpiresAt]);
  
  return useAsyncCache(
    ["user", "me"],
    () => users.getMe(),
    { 
      ttl,
      enabled: !!authToken
    }
  );
};

export const useUpdateUser = () => {
  const { refresh } = useAsyncCache(["user", "me"], () => Promise.resolve(null));
  
  return {
    mutate: async (payload: UpdateUserPayload) => {
      const result = await users.updateMe(payload);
      await refresh();
      return result;
    },
    isLoading: false,
  };
}; 