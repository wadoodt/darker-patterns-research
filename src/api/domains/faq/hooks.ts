
import { useAsyncCache } from "@hooks/useAsyncCache";
import { faq } from "./index";
import type { FaqItem, FaqCategory } from "./types";

export const useFaqs = (category?: FaqCategory) => {
  const categoryKey = category || "all";
  return useAsyncCache(
    ["faqs", categoryKey],
    () => faq.getFaqs(category),
    { ttl: 5 * 60 * 1000 } // 5 minutes
  );
};

export const useCreateFaq = () => {
  const { refresh } = useAsyncCache(["faqs"], () => Promise.resolve([]));
  
  return {
    mutate: async (newFaq: Omit<FaqItem, "id">) => {
      const result = await faq.createFaq(newFaq);
      await refresh();
      return result;
    },
    isLoading: false,
  };
};

export const useUpdateFaq = () => {
  const { refresh } = useAsyncCache(["faqs"], () => Promise.resolve([]));
  
  return {
    mutate: async (updatedFaq: FaqItem) => {
      const result = await faq.updateFaq(updatedFaq);
      await refresh();
      return result;
    },
    isLoading: false,
  };
};

export const useDeleteFaq = () => {
  const { refresh } = useAsyncCache(["faqs"], () => Promise.resolve([]));
  
  return {
    mutate: async (id: string) => {
      await faq.deleteFaq(id);
      await refresh();
    },
    isLoading: false,
  };
}; 