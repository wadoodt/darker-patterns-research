import { useRef, useState, useEffect, useMemo } from 'react';
import kvidb from '../../lib/cache/kvidb';
import { CacheLevel, type CacheEntry, CACHE_TTL_MAP } from '../../lib/cache/types';
import { CacheContext } from './context';
import type { CacheContextValue, CacheProviderProps, KvDbType } from './types';
import { normalizeKeys, cleanupExpiredEntries, matchPattern } from './utils';

export function CacheProvider({
  children,
  dbName = 'AppCacheDB',
  cleanupIntervalMs = 1000 * 60 * 10,
}: CacheProviderProps) {
  const kvRef = useRef<KvDbType | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;
    kvidb(dbName, 'cache').then((kv) => {
      if (mounted) {
        // Adapt kv to match KvDbType interface
        kvRef.current = {
          get: kv.get,
          put: kv.put,
          del: kv.del,
          keys: async () => {
            const keys = await kv.keys();
            // Convert IDBValidKey[] to string[]
            return keys.map((k) => typeof k === 'string' ? k : String(k));
          },
        };
        setIsReady(true);
      }
    }).catch((e) => setError(e));
    return () => { mounted = false; };
  }, [dbName]);

  // Cleanup expired entries on interval and window focus
  useEffect(() => {
    if (!isReady) return;
    const cleanup = async () => {
      try {
        if (!kvRef.current) return;
        await cleanupExpiredEntries({ kv: kvRef.current });
      } catch (e) {
        setError(e instanceof Error ? e : new Error(String(e)));
      }
    };
    window.addEventListener('focus', cleanup);
    const intervalId = setInterval(cleanup, cleanupIntervalMs);
    return () => {
      window.removeEventListener('focus', cleanup);
      clearInterval(intervalId);
    };
  }, [isReady, cleanupIntervalMs]);

  const contextValue: CacheContextValue = useMemo(() => ({
    isReady,
    error,
    set: async <T,>(key: string, data: T, level: CacheLevel = CacheLevel.STANDARD, customTtlMs?: number) => {
      if (!kvRef.current) return;
      const now = Date.now();
      const ttl = customTtlMs ?? CACHE_TTL_MAP[level];
      const entry: CacheEntry<T> = { key, data, createdAt: now, expiresAt: now + ttl, level };
      await kvRef.current.put(key, entry);
    },
    get: async <T,>(key: string): Promise<T | null> => {
      if (!kvRef.current) return null;
      const entry: CacheEntry<T> | undefined = await kvRef.current.get(key);
      if (!entry) return null;
      if (entry.expiresAt <= Date.now()) {
        await kvRef.current.del(key);
        return null;
      }
      return entry.data as T;
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
  }), [isReady, error]);

  return <CacheContext.Provider value={contextValue}>{children}</CacheContext.Provider>;
}
