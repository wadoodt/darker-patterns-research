
import { useAsyncCache } from "@hooks/useAsyncCache";
import { knowledgeBase } from "./index";
import type { KnowledgeBaseArticle } from "./types";
import { cacheKeys } from "@api/cacheKeys";
import { useCache } from "@contexts/CacheContext";

const KB_CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export const useArticles = ({ page = 1, limit = 10 }: { page?: number, limit?: number } = {}) => {
  return useAsyncCache(
    cacheKeys.knowledgeBase.articles(page, limit),
    () => knowledgeBase.getArticles({ page, limit }),
    { ttl: KB_CACHE_TTL }
  );
};

export const useCreateArticle = () => {
  const { invalidateCacheKeys } = useCache();
  
  return {
    mutate: async (article: Omit<KnowledgeBaseArticle, "id">) => {
      const result = await knowledgeBase.createArticle(article);
      await invalidateCacheKeys(cacheKeys.knowledgeBase.articlesPrefix);
      return result;
    },
  };
};

export const useUpdateArticle = () => {
  const { invalidateCacheKeys } = useCache();
  
  return {
    mutate: async (article: KnowledgeBaseArticle) => {
      const result = await knowledgeBase.updateArticle(article);
      await invalidateCacheKeys(cacheKeys.knowledgeBase.articlesPrefix);
      return result;
    },
  };
};

export const useDeleteArticle = () => {
  const { invalidateCacheKeys } = useCache();
  
  return {
    mutate: async (id: string) => {
      await knowledgeBase.deleteArticle(id);
      await invalidateCacheKeys(cacheKeys.knowledgeBase.articlesPrefix);
    },
  };
};
