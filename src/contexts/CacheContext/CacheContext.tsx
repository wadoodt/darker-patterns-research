import { useMemo } from "react";
import { CacheLevel, type CacheEntry, CACHE_TTL_MAP } from "@lib/cache/types";
import { CacheContext } from "./context";
import type { CacheContextValue, CacheProviderProps } from "./types";
import { normalizeKeys, cleanupExpiredEntries, matchPattern } from "./utils";
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

  const contextValue: CacheContextValue = useMemo(
    () => ({
      isReady,
      error,
      set: async <T,>(
        key: string,
        data: T,
        level: CacheLevel = CacheLevel.STANDARD,
        customTtlMs?: number,
      ) => {
        if (!kvRef.current) return;
        const now = Date.now();
        const ttl = customTtlMs ?? CACHE_TTL_MAP[level];
        const entry: CacheEntry<T> = {
          key,
          data,
          createdAt: now,
          expiresAt: now + ttl,
          level,
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
      invalidateByPattern: async (pattern: string) => {
        if (!kvRef.current) return;
        const matcher = matchPattern(pattern);
        const keys: string[] = normalizeKeys(await kvRef.current.keys());
        for (const key of keys) {
          if (matcher(key)) {
            await kvRef.current.del(key);
          }
        }
      },
      cleanupExpired: async () => {
        if (!kvRef.current) return;
        await cleanupExpiredEntries({ kv: kvRef.current });
      },
      cleanupByLevel: async (level: CacheLevel) => {
        if (!kvRef.current) return;
        await cleanupExpiredEntries({ kv: kvRef.current, level });
      },
    }),
    [isReady, error, kvRef],
  );

  return (
    <CacheContext.Provider value={contextValue}>
      {children}
    </CacheContext.Provider>
  );
}
