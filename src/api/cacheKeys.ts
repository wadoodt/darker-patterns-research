import { CACHE_TTL } from '@lib/cache/constants';

/**
 * Standardized cache key factories for API domains.
 * Ensures consistency, type safety, and centralized management of cache keys.
 */
export const cacheKeys = {
  /**
   * User-related cache keys.
   */
  users: {
    /**
     * Key for the current authenticated user's profile.
     * TTL is handled dynamically in the `useUser` hook based on token expiration.
     */
    me: () => ({ key: ["users", "me"] }),
    /**
     * Prefix for invalidating the current user's data.
     */
    mePrefix: ["users", "me"],
  },

  /**
   * Team-related cache keys.
   */
  team: {
    /**
     * Key for the paginated list of team members.
     */
    members: (page: number, limit: number) => ({
      key: ['team', 'members', page, limit],
      ttl: CACHE_TTL.STANDARD_5_MIN,
    }),
    membersPrefix: ["team", "members"],
    member: (id: string) => ({
      key: ['team', 'member', id],
      ttl: CACHE_TTL.DEFAULT_15_MIN,
    }),
    memberPrefix: (id: string) => ["team", "member", id],
  },

  /**
   * Support ticket-related cache keys.
   */
  support: {
    /**
     * Key for the paginated list of the user's support tickets.
     */
    all: (page: number, limit: number) => ({
      key: ['support', 'tickets', page, limit],
      ttl: CACHE_TTL.STANDARD_5_MIN,
    }),
    /**
     * Key for a single support ticket's details.
     */
    one: (id: string) => ({
      key: ['support', 'tickets', id],
      ttl: CACHE_TTL.DEFAULT_15_MIN,
    }),
    allPrefix: ["support", "tickets"],
  },

  /**
   * FAQ-related cache keys.
   */
  faqs: {

    all: (category: string, page: number, limit: number) => ({
      key: ["faqs", category, page, limit],
      ttl: CACHE_TTL.IMPORTANT_1_HOUR,
    }),
    allPrefix: ["faqs"],
  },

  /**
   * Knowledge base-related cache keys.
   */
  knowledgeBase: {
    /**
     * Key for the list of all knowledge base articles.
     */
    articles: (page: number, limit: number) => ({
      key: ['knowledge-base', 'articles', page, limit],
      ttl: CACHE_TTL.IMPORTANT_1_HOUR,
    }),
    /**
     * Key for a single knowledge base article.
     */
    article: (id: string) => ({
      key: ['knowledge-base', 'article', id],
      ttl: CACHE_TTL.LONG_1_DAY,
    }),
    articlesPrefix: ["knowledge-base", "articles"],
  },

  /**
   * Admin-related cache keys.
   */
  admin: {
    /**
     * Key for the paginated list of all users (admin view).
     */
    users: (page: number, limit: number) => ({
      key: ["admin", "users", page, limit],
      ttl: CACHE_TTL.STANDARD_5_MIN,
    }),
    usersPrefix: ["admin", "users"],
    /**
     * Key for the paginated list of all support tickets (admin view).
     */
    tickets: (page: number, limit: number) => ({
      key: ["admin", "tickets", page, limit],
      ttl: CACHE_TTL.STANDARD_5_MIN,
    }),
    ticketsPrefix: ["admin", "tickets"],
  },

  /**
   * Payment-related cache keys.
   */
  payments: {
    /**
     * Key for a single payment's details.
     */
    one: (id: string) => ({
      key: ["payments", "one", id],
      ttl: CACHE_TTL.DEFAULT_15_MIN,
    }),
    /**
     * Prefix for invalidating all payments.
     */
    allPrefix: ["payments"],
  },

  /**
   * Company-related cache keys.
   */
  companies: {
    /**
     * Key for the list of all companies.
     */
    all: (page: number, limit: number) => ({
      key: ["companies", "all", page, limit],
      ttl: CACHE_TTL.IMPORTANT_1_HOUR,
    }),
  },

  /**
   * Notifications-related cache keys.
   */
  notifications: {
    all: (page: number, limit: number) => ({
      key: ["notifications", "all", page, limit],
      ttl: CACHE_TTL.SESSION,
    }),
    allPrefix: ["notifications", "all"],
  },
};
