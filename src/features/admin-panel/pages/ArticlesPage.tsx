import React from "react";
import { Box } from "@radix-ui/themes";
import { useArticlesPage } from "./articles/hooks/useArticlesPage";
import { HeaderSection } from "./articles/sections/HeaderSection";
import { ArticlesTableSection } from "./articles/sections/ArticlesTableSection";
import { ModalsSection } from "./articles/sections/ModalsSection";

const ArticlesPage: React.FC = () => {
  const {
    t,
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

  if (error) return <Box>{t("articles.errorLoading")}</Box>;

  return (
    <Box>
      <HeaderSection t={t} onCreate={() => setCreateModalOpen(true)} />
      <ArticlesTableSection
        articles={articles || []}
        t={t}
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
