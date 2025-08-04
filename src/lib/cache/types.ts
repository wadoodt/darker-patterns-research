// src/lib/cache/types.ts
import type kvidb from "./kvidb";

/**
 * Represents the structure of an entry in the IndexedDB cache.
 */
export interface CacheEntry<T = unknown> {
  key: string;
  data: T;
  createdAt: number;
  expiresAt: number;
  updatedAt?: number;
}

/**
 * Represents the type of the key-value database instance.
 * This is derived from the return type of the kvidb function.
 */
export type KviDb = Awaited<ReturnType<typeof kvidb>>;
