import type { ReactNode } from 'react';
import { CacheLevel, type CacheEntry } from '../../lib/cache/types';

export interface CacheContextValue {
  set: <T>(key: string, data: T, level?: CacheLevel, customTtlMs?: number) => Promise<void>;
  get: <T>(key: string) => Promise<T | null>;
  invalidateByPattern: (pattern: string) => Promise<void>;
  cleanupExpired: () => Promise<void>;
  cleanupByLevel: (level: CacheLevel) => Promise<void>;
  isReady: boolean;
  error: Error | null;
}

export interface CacheProviderProps {
  children: ReactNode;
  dbName?: string;
  cleanupIntervalMs?: number;
}

export type KvDbType = {
  get: <T = unknown>(key: string) => Promise<CacheEntry<T> | undefined>;
  put: <T = unknown>(key: string, value: CacheEntry<T>) => Promise<boolean>;
  del: (key: string) => Promise<boolean>;
  keys: () => Promise<(string | number | Date)[]>;
};
