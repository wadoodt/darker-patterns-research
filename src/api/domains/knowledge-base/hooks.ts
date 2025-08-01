
import { useAsyncCache } from "@hooks/useAsyncCache";
import { knowledgeBase } from "./index";
import type { KnowledgeBaseArticle } from "./types";

export const useArticles = () => {
  return useAsyncCache(
    ["knowledge-base", "articles"],
    () => knowledgeBase.getArticles(),
    { ttl: 5 * 60 * 1000 } // 5 minutes
  );
};

export const useCreateArticle = () => {
  const { refresh } = useAsyncCache(["knowledge-base", "articles"], () => Promise.resolve([]));
  
  return {
    mutate: async (article: Omit<KnowledgeBaseArticle, "id">) => {
      const result = await knowledgeBase.createArticle(article);
      await refresh();
      return result;
    },
    isLoading: false,
  };
};

export const useUpdateArticle = () => {
  const { refresh } = useAsyncCache(["knowledge-base", "articles"], () => Promise.resolve([]));
  
  return {
    mutate: async (article: KnowledgeBaseArticle) => {
      const result = await knowledgeBase.updateArticle(article);
      await refresh();
      return result;
    },
    isLoading: false,
  };
};

export const useDeleteArticle = () => {
  const { refresh } = useAsyncCache(["knowledge-base", "articles"], () => Promise.resolve([]));
  
  return {
    mutate: async (id: string) => {
      await knowledgeBase.deleteArticle(id);
      await refresh();
    },
    isLoading: false,
  };
};
