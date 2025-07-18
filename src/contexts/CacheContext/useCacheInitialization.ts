// src/contexts/CacheContext/useCacheInitialization.ts
import { useRef, useState, useEffect } from 'react';
import kvidb from '../../lib/cache/kvidb';
import type { KvDbType } from './types';
import { deleteDatabase, cleanupExpiredEntries } from './utils';

interface UseCacheInitializationProps {
  dbName: string;
  cleanupIntervalMs: number;
}

export function useCacheInitialization({ dbName, cleanupIntervalMs }: UseCacheInitializationProps) {
  const kvRef = useRef<KvDbType | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;

    const initialize = async (retry = true) => {
      try {
        const kv = await kvidb(dbName, 'cache');
        if (mounted) {
          kvRef.current = {
            get: kv.get,
            put: kv.put,
            del: kv.del,
            keys: async () => {
              const keys = await kv.keys();
              return keys.map((k) => String(k));
            },
          };
          setIsReady(true);
          console.log('Cache is ready');
        }
      } catch (e) {
        if (retry && e instanceof DOMException && e.name === 'VersionError') {
          try {
            await deleteDatabase(dbName);
            initialize(false); // Retry without getting into a loop
          } catch (deleteError) {
            if (mounted) {
              const err = deleteError instanceof Error ? deleteError : new Error(String(deleteError));
              console.error('Failed to delete and recreate database:', err);
              setError(err);
            }
          }
        } else if (mounted) {
          const err = e instanceof Error ? e : new Error(String(e));
          console.error('Cache initialization failed:', err);
          setError(err);
        }
      }
    };

    initialize();

    return () => {
      mounted = false;
    };
  }, [dbName]);

  // Effect for periodic cleanup
  useEffect(() => {
    if (!isReady) return;
    const cleanup = async () => {
      if (!kvRef.current) return;
      try {
        await cleanupExpiredEntries({ kv: kvRef.current });
      } catch (e) {
        console.error('Error during cache cleanup:', e);
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

  return { kvRef, isReady, error };
}
