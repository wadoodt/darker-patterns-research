// src/hooks/useAsyncCache.ts
import { useState, useEffect, useCallback, useRef } from 'react';
import { useCache } from '@contexts/CacheContext';
import { createCacheKey } from '@lib/cache/utils';
import { CacheLevel } from '@lib/cache/types';

interface UseAsyncCacheOptions {
  refetchOnMount?: boolean;
  enabled?: boolean;
  customTtl?: number;
}

/**
 * A hook to fetch data, transparently using a client-side cache.
 * Manages loading, error, and data states for you.
 */
export function useAsyncCache<T>(
  keyParts: (string | number)[],
  fetcher: () => Promise<T>,
  level: CacheLevel = CacheLevel.STANDARD,
  options: UseAsyncCacheOptions = {},
) {
  const { refetchOnMount = false, enabled = true, customTtl } = options;
  const { get, set, isReady, error: cacheError } = useCache();

  useEffect(() => {
    if (cacheError) {
      console.warn(`[useAsyncCache] Cache error for key '${keyParts.join(':')}':`, cacheError.message);
    }
  }, [cacheError, keyParts]);

  // Generate a stable cache key
  const cacheKey = createCacheKey('async-data', ...keyParts);

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
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      const canUseCache = isReady && !cacheError;

      try {
        // Try fetching from cache first if possible and not forced
        if (canUseCache && !forceRefresh) {
          const cachedData = await get<T>(cacheKey);
          if (cachedData !== null) {
            if (mounted.current) {
              setData(cachedData);
            }
            return; // Exit early
          }
        }

        // If not in cache, refresh is forced, or cache is unavailable, call the fetcher
        const freshData = await fetcher();

        if (mounted.current) {
          // Only try to set cache if it's available
          if (canUseCache) {
            await set(cacheKey, freshData, level, customTtl);
          }
          setData(freshData);
        }
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to fetch data');
        setError(error);
        console.error(`[useAsyncCache Error: ${cacheKey}]`, error);
      } finally {
        setLoading(false);
      }
    },
    [cacheKey, get, set, fetcher, level, customTtl, isReady, enabled, cacheError],
  );

  // Effect to trigger the initial data load
  useEffect(() => {
    if (enabled && (data === null || refetchOnMount)) {
      loadData();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadData, enabled, refetchOnMount]);

  // Public refresh function
  const refresh = useCallback(() => loadData(true), [loadData]);

  return { data, loading, error, refresh, isReady };
}
