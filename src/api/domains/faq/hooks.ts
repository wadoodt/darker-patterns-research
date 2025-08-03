
import { useAsyncCache } from "@hooks/useAsyncCache";
import { faq } from "./index";
import type { FaqItem, FaqCategory } from "./types";
import { cacheKeys } from "@api/cacheKeys";
import { useCache } from "@contexts/CacheContext";

const FAQ_CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export const useFaqs = ({ category = 'all', page = 1, limit = 10 }: { category?: FaqCategory, page?: number, limit?: number } = {}) => {
  return useAsyncCache(
    cacheKeys.faqs.all(category, page, limit),
    () => faq.getFaqs({ category, page, limit }),
    { ttl: FAQ_CACHE_TTL }
  );
};

export const useCreateFaq = () => {
  const { invalidateCacheKeys } = useCache();
  
  return {
    mutate: async (newFaq: Omit<FaqItem, "id">) => {
      const result = await faq.createFaq(newFaq);
      await invalidateCacheKeys(cacheKeys.faqs.allPrefix);
      return result;
    },
  };
};

export const useUpdateFaq = () => {
  const { invalidateCacheKeys } = useCache();
  
  return {
    mutate: async (updatedFaq: FaqItem) => {
      const result = await faq.updateFaq(updatedFaq);
      await invalidateCacheKeys(cacheKeys.faqs.allPrefix);
      return result;
    },
  };
};

export const useDeleteFaq = () => {
  const { invalidateCacheKeys } = useCache();
  
  return {
    mutate: async (id: string) => {
      await faq.deleteFaq(id);
      await invalidateCacheKeys(cacheKeys.faqs.allPrefix);
    },
  };
}; 