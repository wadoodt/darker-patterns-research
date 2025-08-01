
import apiClient from "@api/client";
import { handleQuery } from "@api/lib/handleQuery";
import { handleMutation } from "@api/lib/handleMutation";
import type { FaqItem, FaqCategory } from "./types";

const getFaqs = async (category: FaqCategory = 'all'): Promise<FaqItem[]> => {
  const url = `/faqs?category=${category}`;
  return handleQuery(() => apiClient.get(url));
};

const createFaq = async (faq: Omit<FaqItem, "id">): Promise<FaqItem> => {
  return handleMutation(() => apiClient.post("/faqs", faq));
};

const updateFaq = async (faq: FaqItem): Promise<FaqItem> => {
  return handleMutation(() => apiClient.put(`/faqs/${faq.id}`, faq));
};

const deleteFaq = async (id: string): Promise<null> => {
  return handleMutation(() => apiClient.delete(`/faqs/${id}`));
};

export const faq = {
  getFaqs,
  createFaq,
  updateFaq,
  deleteFaq,
}; 