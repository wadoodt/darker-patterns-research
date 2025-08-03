// src/hooks/useAsyncCache.ts
import { useState, useEffect, useCallback, useRef } from "react";
import { useCache } from "@contexts/CacheContext";
import { createCacheKey } from "@lib/cache/utils";
import { invalidateCacheKeys } from "@lib/cache/invalidation";
import { CACHE_TTL } from "@lib/cache/constants";

// Track in-flight requests to prevent duplicate fetches for the same key
const inFlightRequests = new Map<string, Promise<unknown>>();

interface UseAsyncCacheOptions {
  refetchOnMount?: boolean;
  enabled?: boolean;
  ttl?: number;
}

export interface CacheKeyConfig {
  key: (string | number)[];
  ttl?: number;
}

// Debug logging utility
function debugLog(message: string, ...args: unknown[]) {
  if (process.env.NODE_ENV === "development") {
    console.log(`%c[useAsyncCache] ${message}`, 'color: #4CAF50; font-weight: bold', ...args);
  }
}

// Custom hook for handling mount state
function useMountedState() {
  const mounted = useRef(true);
  
  useEffect(() => {
    mounted.current = true;
    return () => { mounted.current = false; };
  }, []);
  
  return mounted;
}

// Custom hook for handling cache operations
function useCacheOperations<T>(
  cacheKey: string,
  fetcher: () => Promise<T>,
  { get, set, isReady, error: cacheError }: ReturnType<typeof useCache>,
  ttl: number,
  enabled: boolean
) {
  const fetcherRef = useRef(fetcher);
  
  useEffect(() => {
    fetcherRef.current = fetcher;
  }, [fetcher]);

  const loadFromCache = useCallback(async (): Promise<T | null> => {
    if (!isReady || cacheError) return null;
    
    const cachedData = await get<T>(cacheKey);
    if (cachedData != null) {
      debugLog(`[Cache Hit] < ${cacheKey}`, { data: cachedData });
      return cachedData;
    }
    return null;
  }, [cacheKey, get, isReady, cacheError]);

  const saveToCache = useCallback(async (data: T): Promise<void> => {
    if (isReady && !cacheError) {
      await set(cacheKey, data, ttl);
    }
  }, [cacheKey, set, ttl, isReady, cacheError]);

  const fetchData = useCallback(async (forceRefresh: boolean): Promise<T> => {
    if (!enabled) {
      throw new Error('Fetch called when hook is disabled');
    }

    if (!forceRefresh) {
      const cachedData = await loadFromCache();
      if (cachedData !== null) return cachedData;
    }

    let fetchPromise = inFlightRequests.get(cacheKey) as Promise<T> | undefined;
    if (!fetchPromise) {
      fetchPromise = fetcherRef.current();
      inFlightRequests.set(cacheKey, fetchPromise);
    } else {
      debugLog(`[Cache In-Flight] < ${cacheKey}`);
    }

    try {
      const result = await fetchPromise;
      await saveToCache(result);
      return result;
    } finally {
      inFlightRequests.delete(cacheKey);
    }
  }, [cacheKey, enabled, loadFromCache, saveToCache]);

  return { loadFromCache, saveToCache, fetchData };
}

/**
 * A hook to fetch data, transparently using a client-side cache.
 * Manages loading, error, and data states for you.
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
  const cache = useCache();
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState<Error | null>(null);
  const mounted = useMountedState();
  
  const ttl = keyTtl ?? optionTtl;
  const cacheKey = createCacheKey("async-data", ...keyParts);
  
  const { fetchData } = useCacheOperations(
    cacheKey,
    fetcher,
    cache,
    ttl,
    enabled
  );

  const loadData = useCallback(async (forceRefresh = false) => {
    if (!enabled) {
      if (mounted.current) setLoading(false);
      return;
    }

    if (mounted.current) {
      setLoading(true);
      setError(null);
    }

    try {
      const result = await fetchData(forceRefresh);
      if (mounted.current) {
        setData(result);
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Failed to fetch data");
      if (mounted.current) {
        setError(error);
      }
      console.error(`[useAsyncCache Error: ${cacheKey}]`, error);
    } finally {
      if (mounted.current) {
        setLoading(false);
      }
    }
  }, [cacheKey, enabled, fetchData, mounted]);

  const refresh = useCallback(async (invalidationKey?: (string | number)[]) => {
    if (invalidationKey && cache.db) {
      const invalidationPrefix = createCacheKey("async-data", ...invalidationKey);
      await invalidateCacheKeys(cache.db, invalidationPrefix);
    }
    await loadData(true);
  }, [cache.db, loadData]);

  // Log cache errors
  useEffect(() => {
    if (cache.error) {
      console.warn(
        `[useAsyncCache] Cache error for key '${keyParts.join(":")}':`,
        cache.error.message,
      );
    }
  }, [cache.error, keyParts]);

  // Initial data loading
  useEffect(() => {
    if (cache.isReady && enabled && (data === null || refetchOnMount) && error === null) {
      loadData();
    }
  }, [cache.isReady, loadData, enabled, refetchOnMount, data, error]);

  return { data, loading, error, refresh };
};
