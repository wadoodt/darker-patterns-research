export const MAX_TTL_SECONDS = 60 * 60 * 24 * 30; // 30 days

/**
 * Validates the cache editor inputs.
 * @param ttl - The time-to-live in seconds.
 * @param data - The cache data object.
 * @returns An error message string if validation fails, otherwise null.
 */
export const validateCacheInputs = (ttl: number, data: object): string | null => {
  if (isNaN(ttl) || ttl < 0) {
    return 'TTL must be a positive number';
  }
  
  if (ttl > MAX_TTL_SECONDS) {
    return `TTL cannot be more than ${MAX_TTL_SECONDS / (60 * 60 * 24)} days`;
  }

  if (!data || (typeof data === 'object' && Object.keys(data).length === 0)) {
    return 'Data cannot be empty';
  }

  return null;
};

/**
 * Helper function to format TTL into human-readable format
 * @param seconds - The time-to-live in seconds.
 * @returns A human-readable string representing the TTL.
 */
export function formatTtl(seconds: number): string {
  if (seconds < 60) return `${seconds} seconds`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours`;
  return `${Math.floor(seconds / 86400)} days`;
}