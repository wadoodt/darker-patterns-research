import type { ReactNode } from "react";
import type { KviDb } from "@lib/cache/types";

export interface CacheContextValue {
  set: <T>(key: string, data: T, ttl?: number) => Promise<void>;
  get: <T>(key: string) => Promise<T | null>;

  invalidateCacheKeys: (keyPrefix: string[]) => Promise<void>;
  cleanupExpired: () => Promise<void>;
  isReady: boolean;
  error: Error | null;
  db: KviDb | null;
}

export interface CacheProviderProps {
  children: ReactNode;
  dbName?: string;
  cleanupIntervalMs?: number;
}


