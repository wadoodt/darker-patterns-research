// src/lib/cache/types.ts


/**
 * Defines the persistence level of a cache entry, determining its TTL.
 */
export type CacheLevel = 'STANDARD' | 'PERSISTENT' | 'SESSION' | 'CRITICAL' | 'STABLE' | 'CONFIG' | 'DEBUG';

export const CacheLevel = {
  DEBUG: 'DEBUG' as CacheLevel,
  STANDARD: 'STANDARD' as CacheLevel,
  PERSISTENT: 'PERSISTENT' as CacheLevel,
  SESSION: 'SESSION' as CacheLevel,
  CRITICAL: 'CRITICAL' as CacheLevel,
  STABLE: 'STABLE' as CacheLevel,
  CONFIG: 'CONFIG' as CacheLevel,
};

/**
 * Represents the structure of an entry in the IndexedDB cache.
 */
export interface CacheEntry<T = unknown> {
  key: string;
  data: T;
  createdAt: number;
  expiresAt: number;
  level: CacheLevel;
}

/**
 * Maps each cache level to its duration in milliseconds.
 */
export const CACHE_TTL_MAP: Record<CacheLevel, number> = {
  DEBUG: 1000 * 5,
  CRITICAL: 1000 * 60 * 5, // 5 minutes
  STANDARD: 1000 * 60 * 30, // 30 minutes
  STABLE: 1000 * 60 * 60 * 4, // 4 hours
  SESSION: 1000 * 60 * 60 * 24, // 24 hours
  PERSISTENT: 1000 * 60 * 60 * 24, // 24 hours
  CONFIG: 1000 * 60 * 60 * 24 * 7, // 1 week
};
