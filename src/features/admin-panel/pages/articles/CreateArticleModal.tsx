import React from "react";
import { Dialog } from "@radix-ui/themes";
import { useTranslation } from "react-i18next";
import type { Translation } from "types/knowledge-base";
import { useCreateArticleModal } from "./hooks/useCreateArticleModal";
import { LanguageTabsSection } from "./sections/LanguageTabsSection";
import { ModalActionsSection } from "./sections/ModalActionsSection";

interface CreateArticleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (translations: { [key: string]: Translation }) => Promise<void>;
}

export const CreateArticleModal: React.FC<CreateArticleModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const { t } = useTranslation();
  const {
    form,
    activeLang,
    setActiveLang,
    saving,
    handleFieldChange,
    handleSubmit,
  } = useCreateArticleModal(onSave, onClose);

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Content style={{ maxWidth: 600 }}>
        <Dialog.Title>{t("articles.createArticle")}</Dialog.Title>
        <Dialog.Description>
          {t("articles.createArticleDescription")}
        </Dialog.Description>
        <form onSubmit={handleSubmit}>
          <LanguageTabsSection
            form={form}
            activeLang={activeLang}
            setActiveLang={setActiveLang}
            handleFieldChange={handleFieldChange}
            t={t}
          />
          <ModalActionsSection
            onClose={onClose}
            saving={saving}
            t={t}
            saveLabel={t("common.save")}
          />
        </form>
      </Dialog.Content>
    </Dialog.Root>
  );
};
