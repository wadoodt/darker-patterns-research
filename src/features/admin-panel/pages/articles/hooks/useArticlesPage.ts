
import React from "react";
import type { KnowledgeBaseArticle } from "@api/domains/knowledge-base/types";
import { useArticleManagement } from "./useArticleManagement";
import { getLanguage, fallbackLanguage } from "@locales/i18n";

export function useArticlesPage() {
  const {
    articles,
    isLoading,
    error,
    handleCreate,
    handleUpdate,
    handleDelete,
  } = useArticleManagement();

  const [isCreateModalOpen, setCreateModalOpen] = React.useState(false);
  const [isEditModalOpen, setEditModalOpen] = React.useState(false);
  const [editingArticle, setEditingArticle] =
    React.useState<KnowledgeBaseArticle | null>(null);

  const handleEditClick = (article: KnowledgeBaseArticle) => {
    setEditingArticle(article);
    setEditModalOpen(true);
  };

  return {
    articles,
    isLoading,
    error,
    handleCreate,
    handleUpdate,
    handleDelete,
    isCreateModalOpen,
    setCreateModalOpen,
    isEditModalOpen,
    setEditModalOpen,
    editingArticle,
    setEditingArticle,
    handleEditClick,
    getLanguage,
    fallbackLanguage,
  };
}
