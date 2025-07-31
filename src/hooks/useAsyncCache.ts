// src/hooks/useAsyncCache.ts
import { useState, useEffect, useCallback, useRef } from "react";
import { useCache } from "@contexts/CacheContext";
import { createCacheKey } from "@lib/cache/utils";
import { API_DEBUG_MODE } from "@api/config";
import { CACHE_TTL } from "@lib/cache/constants";

interface UseAsyncCacheOptions {
  refetchOnMount?: boolean;
  enabled?: boolean;
  /**
   * Time To Live for the cache entry, in seconds.
   * Use a value from `CACHE_TTL` for common durations, or provide a custom number.
   * @default CACHE_TTL.DEFAULT_15_MIN
   */
  ttl?: number;
}

/**
 * A hook to fetch data, transparently using a client-side cache.
 * Manages loading, error, and data states for you.
 *
 * @param keyParts A list of strings or numbers to create a unique cache key.
 * @param fetcher An async function that returns the data to be cached.
 * @param options Configuration options for the hook.
 */
export function useAsyncCache<T>(
  keyParts: (string | number)[],
  fetcher: () => Promise<T>,
  options: UseAsyncCacheOptions = {},
) {
  const {
    refetchOnMount = false,
    enabled = true,
    ttl = CACHE_TTL.DEFAULT_15_MIN,
  } = options;
  const { get, set, isReady, error: cacheError } = useCache();

  useEffect(() => {
    if (cacheError) {
      console.warn(
        `[useAsyncCache] Cache error for key '${keyParts.join(":")}':`,
        cacheError.message,
      );
    }
  }, [cacheError, keyParts]);

  const cacheKey = createCacheKey("async-data", ...keyParts);

  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState<Error | null>(null);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const loadData = useCallback(
    async (forceRefresh = false) => {
      if (!enabled) {
        if (mounted.current) {
          setLoading(false);
        }
        return;
      }

      if (mounted.current) {
        setLoading(true);
        setError(null);
      }

      const canUseCache = isReady && !cacheError;

      try {
        if (canUseCache && !forceRefresh) {
          const cachedData = await get<T>(cacheKey);
          if (cachedData !== null && cachedData !== undefined) {
            if (API_DEBUG_MODE) {
              console.log(`[Cache Hit] < ${cacheKey}`, { data: cachedData });
            }
            if (mounted.current) {
              setData(cachedData);
              setLoading(false);
            }
            return;
          }
        }

        const freshData = await fetcher();

        if (mounted.current) {
          if (canUseCache) {
            await set(cacheKey, freshData, ttl);
          }
          setData(freshData);
        }
      } catch (err) {
        const error =
          err instanceof Error ? err : new Error("Failed to fetch data");
        if (mounted.current) {
          setError(error);
        }
        console.error(`[useAsyncCache Error: ${cacheKey}]`, error);
      } finally {
        if (mounted.current) {
          setLoading(false);
        }
      }
    },
    [cacheKey, get, set, fetcher, ttl, isReady, enabled, cacheError],
  );

  useEffect(() => {
    if (enabled && (data === null || refetchOnMount)) {
      loadData();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadData, enabled, refetchOnMount]);

  const refresh = useCallback(() => loadData(true), [loadData]);

  return { data, loading, error, refresh, isReady };
}
