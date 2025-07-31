// src/lib/cache/types.ts

/**
 * Represents the structure of an entry in the IndexedDB cache.
 */
export interface CacheEntry<T = unknown> {
  key: string;
  data: T;
  createdAt: number;
  expiresAt: number;
}
