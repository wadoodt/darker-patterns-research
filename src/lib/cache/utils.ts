// src/lib/cache/utils.ts

import { CacheLevel } from "./types";

/**
 * Creates a standardized cache key from a prefix and parts.
 * Example: createCacheKey('user', '123', 'profile') => "user:123:profile"
 * @param prefix A string to namespace the key (e.g., 'posts', 'user-settings').
 * @param parts The remaining parts of the key.
 * @returns A formatted string key.
 */
export function createCacheKey(
  prefix: string,
  ...parts: (string | number)[]
): string {
  return `${prefix}:${parts.join(":")}`;
}

/**
 * Stores multiple items in the cache in a single, efficient operation.
 *
 * @param cacheSet The `set` function from the `useCache` hook.
 * @param items An array of items to cache.
 */
export async function batchCacheSet<T>(
  cacheSet: (
    key: string,
    data: T,
    level?: CacheLevel,
    customTtl?: number,
  ) => Promise<void>,
  items: Array<{
    keyParts: (string | number)[];
    data: T;
    level?: CacheLevel;
    customTtl?: number;
  }>,
): Promise<void> {
  await Promise.all(
    items.map((item) => {
      // Re-use the key creation logic for consistency
      const key = createCacheKey("async-data", ...item.keyParts);
      return cacheSet(key, item.data, item.level, item.customTtl);
    }),
  );
}
