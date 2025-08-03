// src/hooks/useAsyncCache.ts
import { useState, useEffect, useCallback, useRef } from "react";
import { useCache } from "@contexts/CacheContext";
import { createCacheKey } from "@lib/cache/utils";
import { invalidateCacheKeys } from "@lib/cache/invalidation";
import { API_DEBUG_MODE } from "@api/config";
import { CACHE_TTL } from "@lib/cache/constants";

// Module-level store for in-flight requests to prevent duplicate fetches.
const inFlightRequests = new Map<string, Promise<unknown>>();

interface UseAsyncCacheOptions {
  refetchOnMount?: boolean;
  enabled?: boolean;
  /**
   * Time To Live for the cache entry, in seconds.
   * This can be overridden by the TTL specified in the cache key config.
   * @default CACHE_TTL.DEFAULT_15_MIN
   */
  ttl?: number;
}

interface CacheKeyConfig {
  key: (string | number)[];
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
  cacheConfig: CacheKeyConfig,
  fetcher: () => Promise<T>,
  options: UseAsyncCacheOptions = {},
) {
  const {
    refetchOnMount = false,
    enabled = true,
    ttl: optionTtl = CACHE_TTL.DEFAULT_15_MIN,
  } = options;
  const { key: keyParts, ttl: keyTtl } = cacheConfig;
  const { get, set, isReady, error: cacheError, db } = useCache();
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState<Error | null>(null);
  const mounted = useRef(true);
  const fetcherRef = useRef(fetcher);

  // The TTL from the key factory takes precedence, falling back to the option, then to the default.
  const ttl = keyTtl ?? optionTtl;
  const cacheKey = createCacheKey("async-data", ...keyParts);

  useEffect(() => {
    fetcherRef.current = fetcher;
  }, [fetcher]);

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
            debugLog(`[Cache Hit] < ${cacheKey}`, { data: cachedData });
            if (mounted.current) {
              setData(cachedData);
              setLoading(false);
            }
            return;
          }
        }

        let fetchPromise = inFlightRequests.get(cacheKey) as
          | Promise<T>
          | undefined;

        if (fetchPromise) {
          debugLog(`[Cache In-Flight] < ${cacheKey}`);
        } else {
          fetchPromise = fetcherRef.current();
          inFlightRequests.set(cacheKey, fetchPromise);
        }

        const freshData = await fetchPromise;

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
        // Once settled, remove the request from the in-flight map.
        inFlightRequests.delete(cacheKey);
        if (mounted.current) {
          setLoading(false);
        }
      }
    },
    [cacheKey, get, set, ttl, isReady, enabled, cacheError],
  );

  const refresh = useCallback(
    async (invalidationKey?: (string | number)[]) => {
      if (invalidationKey && db) {
        const invalidationPrefix = createCacheKey("async-data", ...invalidationKey);
        await invalidateCacheKeys(db, invalidationPrefix);
      }
      // Force a refresh of the current hook's data
      await loadData(true);
    },
    [db, loadData],
  );

  useEffect(() => {
    if (cacheError) {
      console.warn(
        `[useAsyncCache] Cache error for key '${keyParts.join(":")}':`,
        cacheError.message,
      );
    }
  }, [cacheError, keyParts]);

  useEffect(() => {
    // Only attempt to load data if the cache is ready and no error has occurred.
    if (isReady && enabled && (data === null || refetchOnMount) && error === null) {
      loadData();
    }
  }, [isReady, loadData, enabled, refetchOnMount, data, error]);

  return { data, loading, error, refresh };
}

const debugLog = (message: string, ...args: unknown[]) => {
  if (API_DEBUG_MODE) {
    console.log(message, ...args);
  }
};
