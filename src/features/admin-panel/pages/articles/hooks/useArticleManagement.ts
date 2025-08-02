
import { useTranslation } from "react-i18next";
import {
  useArticles,
  useCreateArticle,
  useUpdateArticle,
  useDeleteArticle,
} from "@api/domains/knowledge-base/hooks";
import type { KnowledgeBaseArticle } from "@api/domains/knowledge-base/types";

export const useArticleManagement = () => {
  const { t } = useTranslation();
  const { data, loading: isLoading, error } = useArticles();
  const { mutate: createArticle } = useCreateArticle();
  const { mutate: updateArticle } = useUpdateArticle();
  const { mutate: deleteArticle } = useDeleteArticle();

  const handleCreate = async (article: Omit<KnowledgeBaseArticle, "id">) => {
    createArticle(article);
  };

  const handleUpdate = async (article: KnowledgeBaseArticle) => {
    updateArticle(article);
  };

  const handleDelete = async (id: string): Promise<null> => {
    if (window.confirm(t("articles.deleteConfirmation"))) {
      await deleteArticle(id);
      return null;
    }
    return null;
  };

  return {
    articles: data?.articles || [],
    isLoading,
    error,
    handleCreate,
    handleUpdate,
    handleDelete,
  };
};
