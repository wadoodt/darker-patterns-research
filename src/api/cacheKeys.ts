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
    mePrefix: ["users", "me"],
    me: () => ({ key: cacheKeys.users.mePrefix }),
  },

  /**
   * Team-related cache keys.
   */
  team: {
    membersPrefix: ["team", "members"],
    members: (page: number, limit: number) => ({
      key: [...cacheKeys.team.membersPrefix, page, limit],
      ttl: CACHE_TTL.STANDARD_5_MIN,
    }),
    memberPrefix: (id: string) => ["team", "member", id],
    member: (id: string) => ({
      key: cacheKeys.team.memberPrefix(id),
      ttl: CACHE_TTL.DEFAULT_15_MIN,
    }),
  },

  /**
   * Support ticket-related cache keys.
   */
  support: {
    allPrefix: ["support", "tickets"],
    all: (page: number, limit: number) => ({
      key: [...cacheKeys.support.allPrefix, page, limit],
      ttl: CACHE_TTL.STANDARD_5_MIN,
    }),
    one: (id: string) => ({
      key: [...cacheKeys.support.allPrefix, id],
      ttl: CACHE_TTL.DEFAULT_15_MIN,
    }),
  },

  /**
   * FAQ-related cache keys.
   */
  faqs: {
    allPrefix: ["faqs"],
    all: (category: string, page: number, limit: number) => ({
      key: [...cacheKeys.faqs.allPrefix, category, page, limit],
      ttl: CACHE_TTL.IMPORTANT_1_HOUR,
    }),
  },

  /**
   * Knowledge base-related cache keys.
   */
  knowledgeBase: {
    articlesPrefix: ["knowledge-base", "articles"],
    articles: (page: number, limit: number) => ({
      key: [...cacheKeys.knowledgeBase.articlesPrefix, page, limit],
      ttl: CACHE_TTL.IMPORTANT_1_HOUR,
    }),
    articlePrefix: (id: string) => ["knowledge-base", "article", id],
    article: (id: string) => ({
      key: cacheKeys.knowledgeBase.articlePrefix(id),
      ttl: CACHE_TTL.LONG_1_DAY,
    }),
  },

  /**
   * Admin-related cache keys.
   */
  admin: {
    usersPrefix: ["admin", "users"],
    users: (page: number, limit: number) => ({
      key: [...cacheKeys.admin.usersPrefix, page, limit],
      ttl: CACHE_TTL.STANDARD_5_MIN,
    }),
    ticketsPrefix: ["admin", "tickets"],
    tickets: (page: number, limit: number) => ({
      key: [...cacheKeys.admin.ticketsPrefix, page, limit],
      ttl: CACHE_TTL.STANDARD_5_MIN,
    }),
  },

  /**
   * Payment-related cache keys.
   */
  payments: {
    allPrefix: ["payments"],
    one: (id: string) => ({
      key: [...cacheKeys.payments.allPrefix, "one", id],
      ttl: CACHE_TTL.DEFAULT_15_MIN,
    }),
  },

  /**
   * Company-related cache keys.
   */
  companies: {
    allPrefix: ["companies", "all"],
    all: (page: number, limit: number) => ({
      key: [...cacheKeys.companies.allPrefix, page, limit],
      ttl: CACHE_TTL.IMPORTANT_1_HOUR,
    }),
  },

  /**
   * Notifications-related cache keys.
   */
  notifications: {
    allPrefix: ["notifications", "all"],
    all: (page: number, limit: number) => ({
      key: [...cacheKeys.notifications.allPrefix, page, limit],
      ttl: CACHE_TTL.SESSION,
    }),
  },
};
