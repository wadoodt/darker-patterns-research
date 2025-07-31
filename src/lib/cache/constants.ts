/**
 * Common cache TTL (Time To Live) values, in seconds.
 * Use these for clarity and IntelliSense hints.
 */
export const CACHE_TTL = {
  /** 5 minutes (300 seconds) */
  STANDARD_5_MIN: 300,
  /** 15 minutes (900 seconds) */
  DEFAULT_15_MIN: 900,
  /** 1 hour (3600 seconds) */
  IMPORTANT_1_HOUR: 3600,
  /** 1 day (86400 seconds) */
  LONG_1_DAY: 86400,
  /**
   * Session-only cache.
   * The underlying kvi-db doesn't have a true session concept,
   * so we use a very high value to simulate 'never expires' for the session duration.
   * Actual cleanup of expired items is handled by the cache context.
   */
  SESSION: -1,
} as const;
