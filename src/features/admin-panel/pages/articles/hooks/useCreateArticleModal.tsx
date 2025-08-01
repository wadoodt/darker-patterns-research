import type { ArticleTranslation } from "@api/domains/knowledge-base/types";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { CreateArticleModal } from "../CreateArticleModal";

const languages = [
  { code: "en", name: "English" },
  { code: "es", name: "Español" },
];

export function useCreateArticleModal({
  handleCreate,
}: {
  handleCreate: (translations: { [key: string]: ArticleTranslation }) => void;
}) {
  const { t } = useTranslation();
  const [isModalOpen, setModalOpen] = useState(false);

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  const onSave = (translations: { [key: string]: ArticleTranslation }) => {
    handleCreate(translations);
    closeModal();
  };

  return {
    isModalOpen,
    openModal,
    closeModal,
    CreateArticleModal: () => (
      <CreateArticleModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSave={onSave}
      />
    ),
    languages,
    t,
  };
} 