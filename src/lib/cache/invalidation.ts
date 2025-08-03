import kvidb from './kvidb';

type KviDb = Awaited<ReturnType<typeof kvidb>>;

/**
 * Invalidates cache entries based on a key prefix.
 *
 * This function iterates through all keys in the database and removes entries
 * whose keys start with the specified prefix.
 *
 * @param db - The KviDb instance to operate on.
 * @param prefix - The prefix to match for invalidation (e.g., 'async-data:team:members').
 * @returns A promise that resolves when the invalidation is complete.
 */
export const invalidateCacheKeys = async (
  db: KviDb | null,
  prefix: string,
): Promise<void> => {
  if (!db) return;

  try {
    const allKeys = await db.keys();
    const keysToRemove = allKeys.filter((key) => String(key).startsWith(prefix));

    if (keysToRemove.length > 0) {
            await Promise.all(keysToRemove.map((key) => db.del(key)));
      console.log(`[Cache Invalidation] Removed ${keysToRemove.length} keys with prefix: ${prefix}`);
    }
  } catch (error) {
    console.error('[Cache Invalidation] Failed to invalidate keys:', error);
  }
};
