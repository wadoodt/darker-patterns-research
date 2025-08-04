
import { handleQuery } from "@api/lib/handleQuery";
import { handleMutation } from "@api/lib/handleMutation";
import type { FaqItem, FaqCategory } from "./types";

/**
 * Fetches a list of FAQs, with optional filtering and pagination.
 * @param {object} [params] - Optional query parameters.
 * @param {FaqCategory} [params.category] - Filter by category.
 * @param {number} [params.page] - The page number to fetch.
 * @param {number} [params.limit] - The number of items per page.
 * @returns {Promise<{ faqs: FaqItem[] }>} A promise that resolves with the list of FAQs.
 */
const getFaqs = (params: { category?: FaqCategory, page?: number, limit?: number } = {}): Promise<{ faqs: FaqItem[]}> => {
  return handleQuery<{ faqs: FaqItem[]}>('/faqs', { params });
};

/**
 * Creates a new FAQ item.
 * @param {Omit<FaqItem, "id">} faq - The FAQ data to create.
 * @returns {Promise<FaqItem>} A promise that resolves with the newly created FAQ item.
 */
const createFaq = (faq: Omit<FaqItem, "id">): Promise<FaqItem> => {
  return handleMutation.post("/faqs", faq);
};

/**
 * Updates an existing FAQ item.
 * @param {FaqItem} faq - The FAQ data to update.
 * @returns {Promise<FaqItem>} A promise that resolves with the updated FAQ item.
 */
const updateFaq = (faq: FaqItem): Promise<FaqItem> => {
  return handleMutation.put(`/faqs/${faq.id}`, faq);
};

/**
 * Deletes an FAQ item by its ID.
 * @param {string} id - The ID of the FAQ to delete.
 * @returns {Promise<null>} A promise that resolves when the FAQ is successfully deleted.
 */
const deleteFaq = (id: string): Promise<null> => {
  return handleMutation.delete(`/faqs/${id}`);
};

export const faq = {
  getFaqs,
  createFaq,
  updateFaq,
  deleteFaq,
}; 