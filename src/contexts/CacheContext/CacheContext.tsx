import { useMemo, useCallback } from "react";
import { type CacheEntry } from "@lib/cache/types";
import { CACHE_TTL } from "@lib/cache/constants";
import { CacheContext } from "./context";
import type { CacheContextValue, CacheProviderProps } from "./types";
import { cleanupExpiredEntries } from "./utils";
import { useCacheInitialization } from "./useCacheInitialization";

export function CacheProvider({
  children,
  dbName = "AppCacheDB",
  cleanupIntervalMs = 1000 * 60 * 10,
}: CacheProviderProps) {
  const { kvRef, isReady, error } = useCacheInitialization({
    dbName,
    cleanupIntervalMs,
  });



  const invalidateCacheKeys = useCallback(async (keyPrefix: string[]) => {
    if (!kvRef.current) return;

    const allKeys = await kvRef.current.keys();
    const keysToDelete = allKeys.filter((key) => {
      if (typeof key !== "string") return false;
      const keyParts = key.split(":");
      return keyPrefix.every((part, i) => part === keyParts[i]);
    });

    if (keysToDelete.length > 0) {
      await Promise.all(keysToDelete.map((key) => kvRef.current!.del(key)));
    }
  }, [kvRef]);

  const contextValue: CacheContextValue = useMemo(
    () => ({
      isReady,
      error,
      db: kvRef.current,
      set: async <T,>(
        key: string,
        data: T,
        ttl: number = CACHE_TTL.DEFAULT_15_MIN,
      ) => {
        if (!kvRef.current) return;
        const now = Date.now();
        const expiresIn = ttl * 1000; // Convert seconds to milliseconds
        const entry: CacheEntry<T> = {
          key,
          data,
          createdAt: now,
          expiresAt: now + expiresIn,
        };
        await kvRef.current.put(key, entry);
      },
      get: async <T,>(key: string): Promise<T | null> => {
        if (!kvRef.current) return null;
        try {
          const entry: CacheEntry<T> | undefined = await kvRef.current.get(key);

          if (!entry) {
            return null;
          }

          if (entry.expiresAt <= Date.now()) {
            await kvRef.current.del(key);
            return null;
          }

          return entry.data as T;
        } catch (error) {
          console.error(
            `[CacheContext] Failed to get item '${key}' from cache:`,
            error,
          );
          await kvRef.current.del(key);
          return null;
        }
      },
      invalidateCacheKeys,
      cleanupExpired: async () => {
        if (!kvRef.current) return;
        await cleanupExpiredEntries({ kv: kvRef.current });
      },
    }),
    [isReady, error, kvRef, invalidateCacheKeys],
  );

  return (
    <CacheContext.Provider value={contextValue}>
      {children}
    </CacheContext.Provider>
  );
}
