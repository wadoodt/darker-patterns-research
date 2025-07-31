import { useAsyncCache } from "@hooks/useAsyncCache";
import api from "@api/client";
import { CACHE_TTL } from "@lib/cache/constants";
import type { FAQItem } from "types/faq";

export const useFAQManagement = () => {
  const {
    data: faqs,
    loading: isLoading,
    error,
    refresh: mutate,
  } = useAsyncCache<FAQItem[]>(
    ["admin-faqs"],
    async () => {
      const response = await api.get<FAQItem[]>("/faqs");
      return response.data;
    },
    { ttl: CACHE_TTL.SESSION },
  );

  const handleCreate = async (data: { category: string; translations: { [key: string]: { question: string; answer: string } } }) => {
    try {
      await api.post("/faqs", data);
      await mutate();
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const handleUpdate = async (faq: FAQItem) => {
    try {
      await api.put(`/faqs/${faq.id}`, faq);
      await mutate();
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/faqs/${id}`);
      await mutate();
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  return {
    faqs: faqs || [],
    isLoading,
    error,
    handleCreate,
    handleUpdate,
    handleDelete,
  };
};
