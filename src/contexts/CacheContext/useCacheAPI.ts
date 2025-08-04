import { useCallback, useMemo } from "react";
import type { KviDb, CacheEntry } from "@lib/cache/types";
import { CACHE_TTL } from "@lib/cache/constants";
import { cleanupExpiredEntries } from "./utils";
import type { CacheEntryInfo } from "./types";
import { logAuditEvent } from "./auditLogger";

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

  const invalidateCacheKeys = useCallback(async (keyPrefix: string[], source: string = 'admin-panel') => {
    if (!kvRef.current) return 0;
    
    const allKeys = (await kvRef.current.keys()) as string[];
    const prefixStr = keyPrefix.join(":");
    const keysToDelete = allKeys.filter((k) => k.startsWith(prefixStr));
    
    if (keysToDelete.length > 0) {
      // Get all entries before deletion for audit logging
      const entries = await Promise.all(
        keysToDelete.map(async (key) => ({
          key,
          entry: await kvRef.current!.get<CacheEntry>(key),
        }))
      );
      
      // Delete all keys
      await Promise.all(keysToDelete.map((k) => kvRef.current!.del(k)));
      
      // Log invalidation events
      for (const { key, entry } of entries) {
        if (entry) {
          logAuditEvent({
            action: 'INVALIDATE',
            key,
            oldValue: entry.data,
            source,
          });
        }
      }
    }
    
    return keysToDelete.length;
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

  const updateEntry = useCallback(async <T,>(
    key: string,
    data: T,
    ttl: number = CACHE_TTL.DEFAULT_15_MIN,
    source: string = 'admin-panel',
  ) => {
    if (!kvRef.current) return;
    
    // Get existing entry to preserve creation time
    const existingEntry = await kvRef.current.get<CacheEntry<T>>(key);
    const now = Date.now();
    
    const entry: CacheEntry<T> = {
      key,
      data,
      createdAt: existingEntry?.createdAt ?? now,
      expiresAt: now + ttl * 1000,
      updatedAt: now,
    };
    
    await kvRef.current.put(key, entry);
    
    // Log the update
    console.log(`[Cache] Updated entry '${key}' with TTL: ${ttl}s`);
    
    // Log audit event
    logAuditEvent({
      action: 'UPDATE',
      key,
      oldValue: existingEntry?.data,
      newValue: data,
      ttl,
      source,
    });
  }, [kvRef]);
  
  const getKeyTTL = useCallback(async (key: string): Promise<number | null> => {
    if (!kvRef.current) return null;
    const entry = await kvRef.current.get<CacheEntry>(key);
    if (!entry) return null;
    const remainingMs = entry.expiresAt - Date.now();
    return Math.max(0, Math.ceil(remainingMs / 1000)); // Convert to seconds, ensure non-negative
  }, [kvRef]);
  
  const isEditableKey = useCallback((key: string): boolean => {
    // By default, all keys are editable except those starting with 'auth:'
    // Add more restrictions as needed
    return !key.startsWith('auth:');
  }, []);

  const deleteEntry = useCallback(async (key: string, source: string = 'admin-panel') => {
    if (!kvRef.current) return;
    
    // Get the entry before deleting for audit logging
    const existingEntry = await kvRef.current.get<CacheEntry>(key);
    
    await kvRef.current.del(key);
    console.log(`[Cache] Deleted entry '${key}'`);
    
    // Log audit event
    if (existingEntry) {
      logAuditEvent({
        action: 'DELETE',
        key,
        oldValue: existingEntry.data,
        source,
      });
    }
  }, [kvRef]);

  return { getEntryData, updateEntry, deleteEntry, getKeyTTL, isEditableKey };
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
