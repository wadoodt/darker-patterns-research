import { useCallback, useMemo } from "react";
import type { KviDb, CacheEntry } from "@lib/cache/types";
import { CACHE_TTL } from "@lib/cache/constants";
import { cleanupExpiredEntries } from "./utils";
import type { CacheEntryInfo } from "./types";

function useCacheRead(kvRef: React.RefObject<KviDb | null>) {
  const get = useCallback(async <T,>(key: string): Promise<T | null> => {
    if (!kvRef.current) return null;
    try {
      const entry: CacheEntry<T> | undefined = await kvRef.current.get(key);
      if (!entry || entry.expiresAt <= Date.now()) {
        if (entry) await kvRef.current.del(key);
        return null;
      }
      return entry.data as T;
    } catch (error) {
      console.error(`[Cache] Failed to get '${key}':`, error);
      await kvRef.current.del(key);
      return null;
    }
  }, [kvRef]);

  return { get };
}

function useCacheWrite(kvRef: React.RefObject<KviDb | null>) {
  const set = useCallback(async <T,>(
    key: string,
    data: T,
    ttl: number = CACHE_TTL.DEFAULT_15_MIN,
  ) => {
    if (!kvRef.current) return;
    const now = Date.now();
    const entry: CacheEntry<T> = {
      key,
      data,
      createdAt: now,
      expiresAt: now + ttl * 1000,
    };
    await kvRef.current.put(key, entry);
  }, [kvRef]);

  const invalidateCacheKeys = useCallback(async (keyPrefix: string[]) => {
    if (!kvRef.current) return;
    const allKeys = (await kvRef.current.keys()) as string[];
    const prefixStr = keyPrefix.join(":");
    const keysToDelete = allKeys.filter((k) => k.startsWith(prefixStr));
    if (keysToDelete.length > 0) {
      await Promise.all(keysToDelete.map((k) => kvRef.current!.del(k)));
    }
  }, [kvRef]);

  const cleanupExpired = useCallback(async () => {
    if (!kvRef.current) return;
    await cleanupExpiredEntries({ kv: kvRef.current });
  }, [kvRef]);

  return { set, invalidateCacheKeys, cleanupExpired };
}

function useCacheInspect(kvRef: React.RefObject<KviDb | null>) {
  const listKeys = useCallback(async (prefix?: string, cursor?: string, limit = 50) => {
    if (!kvRef.current) return { keys: [], hasMore: false };
    const allKeys = ((await kvRef.current.keys()) as string[]).sort();
    const filtered = prefix ? allKeys.filter((k) => k.startsWith(prefix)) : allKeys;
    const start = cursor ? filtered.indexOf(cursor) + 1 : 0;
    const paginated = filtered.slice(start, start + limit);
    const hasMore = start + limit < filtered.length;
    return { keys: paginated, cursor: hasMore ? paginated.at(-1) : undefined, hasMore };
  }, [kvRef]);

  const inspectEntry = useCallback(async (key: string): Promise<CacheEntryInfo | null> => {
    if (!kvRef.current) return null;
    const entry: CacheEntry<unknown> | undefined = await kvRef.current.get(key);
    if (!entry) return null;
    const dataStr = JSON.stringify(entry.data);
    return {
      key: entry.key,
      createdAt: entry.createdAt,
      expiresAt: entry.expiresAt,
      size: new TextEncoder().encode(dataStr).length,
      dataPreview: dataStr.slice(0, 100) + (dataStr.length > 100 ? "..." : ""),
    };
  }, [kvRef]);

  return { listKeys, inspectEntry };
}

function useCacheEdit(kvRef: React.RefObject<KviDb | null>) {
  const getEntryData = useCallback(async <T,>(key: string): Promise<T | null> => {
    if (!kvRef.current) return null;
    const entry: CacheEntry<T> | undefined = await kvRef.current.get(key);
    return entry ? entry.data : null;
  }, [kvRef]);

  const updateEntry = useCallback(async () => {
    throw new Error("Cache entry update not implemented yet.");
  }, []);

  const deleteEntry = useCallback(async (key: string) => {
    if (!kvRef.current) return;
    await kvRef.current.del(key);
  }, [kvRef]);

  return { getEntryData, updateEntry, deleteEntry };
}

export function useCacheAPI(kvRef: React.RefObject<KviDb | null>) {
  const read = useCacheRead(kvRef);
  const write = useCacheWrite(kvRef);
  const inspect = useCacheInspect(kvRef);
  const edit = useCacheEdit(kvRef);

  return useMemo(() => ({ ...read, ...write, ...inspect, ...edit }), [
    read,
    write,
    inspect,
    edit,
  ]);
}
