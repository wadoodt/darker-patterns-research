
import { handleQuery } from "@api/lib/handleQuery";
import { handleMutation } from "@api/lib/handleMutation";
import type { KnowledgeBaseArticle } from "./types";

/**
 * Fetches a paginated list of knowledge base articles.
 * @param {object} [params] - Optional query parameters.
 * @param {number} [params.page] - The page number to fetch.
 * @param {number} [params.limit] - The number of items per page.
 * @returns {Promise<{ articles: KnowledgeBaseArticle[] }>} A promise that resolves with the list of articles.
 */
const getArticles = (params: { page?: number, limit?: number } = {}): Promise<{ articles: KnowledgeBaseArticle[] }> => {
  return handleQuery<{ articles: KnowledgeBaseArticle[] }>("/knowledge-base/articles", { params });
};

/**
 * Creates a new knowledge base article.
 * @param {Omit<KnowledgeBaseArticle, "id">} article - The article data to create.
 * @returns {Promise<KnowledgeBaseArticle>} A promise that resolves with the newly created article.
 */
const createArticle = (article: Omit<KnowledgeBaseArticle, "id">): Promise<KnowledgeBaseArticle> => {
  return handleMutation.post("/knowledge-base/articles", article);
};

/**
 * Updates an existing knowledge base article.
 * @param {KnowledgeBaseArticle} article - The article data to update.
 * @returns {Promise<KnowledgeBaseArticle>} A promise that resolves with the updated article.
 */
const updateArticle = (article: KnowledgeBaseArticle): Promise<KnowledgeBaseArticle> => {
  return handleMutation.put(`/knowledge-base/articles/${article.id}`, article);
};

/**
 * Deletes a knowledge base article by its ID.
 * @param {string} id - The ID of the article to delete.
 * @returns {Promise<null>} A promise that resolves when the article is successfully deleted.
 */
const deleteArticle = (id: string): Promise<null> => {
  return handleMutation.delete(`/knowledge-base/articles/${id}`);
};

export const knowledgeBase = {
  getArticles,
  createArticle,
  updateArticle,
  deleteArticle,
};
