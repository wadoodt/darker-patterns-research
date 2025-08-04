import type { ReactNode } from "react";
import type { KviDb, CacheEntry } from "@lib/cache/types";

export interface CacheEntryInfo extends Omit<CacheEntry<unknown>, "data"> {
  size: number;
  dataPreview: string;
}

export interface CacheContextValue {
  set: <T>(key: string, data: T, ttl?: number) => Promise<void>;
  get: <T>(key: string) => Promise<T | null>;

  invalidateCacheKeys: (keyPrefix: string[], source?: string) => Promise<number>;
  cleanupExpired: () => Promise<void>;
  isReady: boolean;
  error: Error | null;
  db: KviDb | null;

  // --- Inspection API ---
  listKeys: (
    prefix?: string,
    cursor?: string,
    limit?: number,
  ) => Promise<{ keys: string[]; cursor?: string; hasMore: boolean }>;
  inspectEntry: (key: string) => Promise<CacheEntryInfo | null>;

  // --- Editing API ---
  getEntryData: <T = unknown>(key: string) => Promise<T | null>;
  updateEntry: <T>(key: string, data: T, ttl?: number) => Promise<void>;
  deleteEntry: (key: string) => Promise<void>;
  
  // --- Cache Management ---
  getKeyTTL: (key: string) => Promise<number | null>;
  isEditableKey: (key: string) => boolean;
}

export interface CacheProviderProps {
  children: ReactNode;
  dbName?: string;
  cleanupIntervalMs?: number;
}


