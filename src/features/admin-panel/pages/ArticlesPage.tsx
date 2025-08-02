import React from "react";
import { useTranslation } from "react-i18next";
import { Box } from "@radix-ui/themes";
import { useArticlesPage } from "./articles/hooks/useArticlesPage";
import { HeaderSection } from "./articles/sections/HeaderSection";
import { ArticlesTableSection } from "./articles/sections/ArticlesTableSection";
import { ModalsSection } from "./articles/sections/ModalsSection";

const ArticlesPage: React.FC = () => {
  const {
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
    handleEditClick,
    getLanguage,
    fallbackLanguage,
  } = useArticlesPage();
  const { t } = useTranslation();

  if (error) return <Box>{t("articles.errorLoading")}</Box>;

  if (isLoading) return <Box>{t("common.loading")}</Box>;

  if (!articles) return <Box>{t("articles.noArticles")}</Box>;
  
  return (
    <Box>
      <HeaderSection onCreate={() => setCreateModalOpen(true)} />
      <ArticlesTableSection
        articles={articles || []}
        getLanguage={getLanguage}
        fallbackLanguage={fallbackLanguage}
        handleEditClick={handleEditClick}
        handleDelete={handleDelete}
        isLoading={isLoading}
      />
      <ModalsSection
        isCreateModalOpen={isCreateModalOpen}
        setCreateModalOpen={setCreateModalOpen}
        isEditModalOpen={isEditModalOpen}
        setEditModalOpen={setEditModalOpen}
        editingArticle={editingArticle}
        handleCreate={handleCreate}
        handleUpdate={handleUpdate}
      />
    </Box>
  );
};

export default ArticlesPage;
