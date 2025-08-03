import type { KviDb } from "@lib/cache/types";

// Utility to clean up expired entries
type CacheEntryLike = { expiresAt?: number };
type CleanupExpiredOptions = {
  kv: KviDb;
  now?: number;
};
export const cleanupExpiredEntries = async <
  T extends CacheEntryLike = CacheEntryLike,
>({ kv, now = Date.now() }: CleanupExpiredOptions) => {
  const keys = await kv.keys();
  for (const key of keys) {
    const entry = await kv.get<T>(key);
    if (!entry) continue;
    if (entry.expiresAt && entry.expiresAt <= now) {
      await kv.del(key);
    }
  }
};


// Utility to match keys by pattern (supports * wildcard)
export const matchPattern = (pattern: string) => {
  const regex = new RegExp(`^${pattern.replace(/\*/g, ".*")}$`);
  return (key: string) => regex.test(key);
};

// Utility to handle IndexedDB version errors by deleting the database
export const deleteDatabase = (dbName: string): Promise<void> => {
  return new Promise<void>((resolve, reject) => {
    console.warn(`Attempting to delete database: ${dbName}`);
    const deleteRequest = indexedDB.deleteDatabase(dbName);
    deleteRequest.onsuccess = () => {
      console.log(`Database ${dbName} deleted successfully.`);
      resolve();
    };
    deleteRequest.onerror = () => {
      console.error(`Error deleting database ${dbName}.`, deleteRequest.error);
      reject(deleteRequest.error);
    };
    deleteRequest.onblocked = () => {
      console.warn(
        `Database ${dbName} deletion blocked. Please close other tabs with this app open.`,
      );
      reject(new Error("Database deletion blocked."));
    };
  });
};
