import { createContext, useRef, useState, useEffect, type ReactNode, useMemo } from 'react';
import { useContext } from 'react';
import kvidb from '../lib/cache/kvidb';
import { CacheLevel, type CacheEntry, CACHE_TTL_MAP } from '../lib/cache/types';

interface CacheContextValue {
  set: <T>(key: string, data: T, level?: CacheLevel, customTtlMs?: number) => Promise<void>;
  get: <T>(key: string) => Promise<T | null>;
  invalidateByPattern: (pattern: string) => Promise<void>;
  cleanupExpired: () => Promise<void>;
  cleanupByLevel: (level: CacheLevel) => Promise<void>;
  isReady: boolean;
  error: Error | null;
}

const CacheContext = createContext<CacheContextValue | null>(null);

interface CacheProviderProps {
  children: ReactNode;
  dbName?: string;
  cleanupIntervalMs?: number;
}

export function CacheProvider({
  children,
  dbName = 'AppCacheDB',
  cleanupIntervalMs = 1000 * 60 * 10,
}: CacheProviderProps) {
  type KvDbType = {
    get: <T = unknown>(key: string) => Promise<CacheEntry<T> | undefined>;
    put: <T = unknown>(key: string, value: CacheEntry<T>) => Promise<boolean>;
    del: (key: string) => Promise<boolean>;
    keys: () => Promise<(string | number | Date)[]>;
  };
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
        const now = Date.now();
        if (!kvRef.current) return;
        const keys = (await kvRef.current.keys()).map((k) => typeof k === 'string' ? k : String(k));
        for (const key of keys) {
          const entry = await kvRef.current.get(key);
          if (entry && entry.expiresAt && entry.expiresAt <= now) {
            await kvRef.current.del(key);
          }
        }
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
      const regex = new RegExp(`^${pattern.replace(/\*/g, '.*')}$`);
      const keys: string[] = (await kvRef.current.keys()).map((k) => typeof k === 'string' ? k : String(k));
      for (const key of keys) {
        if (regex.test(key)) {
          await kvRef.current.del(key);
        }
      }
    },
    cleanupExpired: async () => {
      if (!kvRef.current) return;
      const now = Date.now();
      const keys: string[] = (await kvRef.current.keys()).map((k) => typeof k === 'string' ? k : String(k));
      for (const key of keys) {
        const entry = await kvRef.current.get(key);
        if (entry && entry.expiresAt && entry.expiresAt <= now) {
          await kvRef.current.del(key);
        }
      }
    },
    cleanupByLevel: async (level: CacheLevel) => {
      if (!kvRef.current) return;
      const now = Date.now();
      const keys: string[] = (await kvRef.current.keys()).map((k) => typeof k === 'string' ? k : String(k));
      for (const key of keys) {
        const entry = await kvRef.current.get(key);
        if (entry && entry.level === level && entry.expiresAt <= now) {
          await kvRef.current.del(key);
        }
      }
    },
  }), [isReady, error]);

  return <CacheContext.Provider value={contextValue}>{children}</CacheContext.Provider>;
}

/**
 * Custom hook to access the raw cache context.
 * Useful for direct operations like invalidation.
 */
export function useCache(): CacheContextValue {
  const context = useContext(CacheContext);
  if (!context) {
    throw new Error('useCache must be used within a CacheProvider');
  }
  return context;
}
