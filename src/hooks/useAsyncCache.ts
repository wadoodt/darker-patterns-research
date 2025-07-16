// src/hooks/useAsyncCache.ts
import { useState, useEffect, useCallback } from 'react';
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
  const { get, set, isReady } = useCache();

  // Generate a stable cache key
  const cacheKey = createCacheKey('async-data', ...keyParts);

  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState<Error | null>(null);

  const loadData = useCallback(
    async (forceRefresh = false) => {
      if (!isReady || !enabled) {
        if (!enabled) setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // Try fetching from cache first unless a refresh is forced
        if (!forceRefresh) {
          const cachedData = await get<T>(cacheKey);
          if (cachedData !== null) {
            setData(cachedData);
            setLoading(false);
            return;
          }
        }

        // If not in cache or refresh is forced, call the fetcher
        const freshData = await fetcher();
        await set(cacheKey, freshData, level, customTtl);
        setData(freshData);
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to fetch data');
        setError(error);
        console.error(`[useAsyncCache Error: ${cacheKey}]`, error);
      } finally {
        setLoading(false);
      }
    },
    [cacheKey, get, set, fetcher, level, customTtl, isReady, enabled],
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
