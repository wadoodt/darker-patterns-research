import React from "react";
import { Dialog } from "@radix-ui/themes";
import { useTranslation } from "react-i18next";
import type { KnowledgeBaseArticle } from "types/knowledge-base";
import { useEditArticleModal } from "./hooks/useEditArticleModal";
import { LanguageTabsSection } from "./sections/LanguageTabsSection";
import { ModalActionsSection } from "./sections/ModalActionsSection";

interface EditArticleModalProps {
  isOpen: boolean;
  onClose: () => void;
  article: KnowledgeBaseArticle | null;
  onSave: (article: KnowledgeBaseArticle) => Promise<void>;
}

export const EditArticleModal: React.FC<EditArticleModalProps> = ({
  isOpen,
  onClose,
  article,
  onSave,
}) => {
  const { t } = useTranslation();
  const {
    editingArticle,
    activeLang,
    setActiveLang,
    saving,
    handleFieldChange,
    handleSubmit,
  } = useEditArticleModal(article, onSave, onClose);

  if (!editingArticle) return null;

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Content style={{ maxWidth: 600 }}>
        <Dialog.Title>{t("articlesPage.editArticle")}</Dialog.Title>
        <Dialog.Description>
          {t("articlesPage.editArticleDescription")}
        </Dialog.Description>
        <form onSubmit={handleSubmit}>
          <LanguageTabsSection
            editingArticle={editingArticle}
            activeLang={activeLang}
            setActiveLang={setActiveLang}
            handleFieldChange={handleFieldChange}
            t={t}
          />
          <ModalActionsSection
            onClose={onClose}
            saving={saving}
            t={t}
            saveLabel={t("articlesPage.saveChanges")}
          />
        </form>
      </Dialog.Content>
    </Dialog.Root>
  );
};
