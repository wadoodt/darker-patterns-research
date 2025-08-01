import type { KnowledgeBaseArticle } from "@api/domains/knowledge-base/types";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { EditArticleModal } from "../EditArticleModal";

const languages = [
  { code: "en", name: "English" },
  { code: "es", name: "Español" },
];

export function useEditArticleModal({
  article,
  handleUpdate,
}: {
  article: KnowledgeBaseArticle | null;
  handleUpdate: (article: KnowledgeBaseArticle) => void;
}) {
  const { t } = useTranslation();
  const [isModalOpen, setModalOpen] = useState(false);
  const [translations, setTranslations] = useState(
    article?.translations || {},
  );

  useEffect(() => {
    if (article) {
      setTranslations(article.translations);
    }
  }, [article]);

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  const onSave = (updatedArticle: KnowledgeBaseArticle) => {
    handleUpdate(updatedArticle);
    closeModal();
  };

  return {
    isModalOpen,
    openModal,
    closeModal,
    EditArticleModal: () => (
      <EditArticleModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSave={onSave}
        article={article}
      />
    ),
    translations,
    setTranslations,
    languages,
    t,
  };
} 