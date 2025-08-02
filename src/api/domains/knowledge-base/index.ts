
import apiClient from "@api/client";
import { handleQuery } from "@api/lib/handleQuery";
import { handleMutation } from "@api/lib/handleMutation";
import type { KnowledgeBaseArticle } from "./types";

const getArticles = async (): Promise<{ articles: KnowledgeBaseArticle[]}> => {
  return handleQuery(() => apiClient.get("/knowledge-base/articles"));
};

const createArticle = async (article: Omit<KnowledgeBaseArticle, "id">): Promise<KnowledgeBaseArticle> => {
  return handleMutation(() => apiClient.post("/knowledge-base/articles", article));
};

const updateArticle = async (article: KnowledgeBaseArticle): Promise<KnowledgeBaseArticle> => {
  return handleMutation(() => apiClient.put(`/knowledge-base/articles/${article.id}`, article));
};

const deleteArticle = async (id: string): Promise<null> => {
  return handleMutation(() => apiClient.delete(`/knowledge-base/articles/${id}`));
};

export const knowledgeBase = {
  getArticles,
  createArticle,
  updateArticle,
  deleteArticle,
};
