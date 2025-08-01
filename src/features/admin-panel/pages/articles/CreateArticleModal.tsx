
import { useState } from "react";
import type { ArticleTranslation } from "@api/domains/knowledge-base/types";
import { useTranslation } from "react-i18next";
import { LanguageTabsSection } from "./sections/LanguageTabsSection";
import { Button, Dialog, Flex } from "@radix-ui/themes";

const languages = [
  { code: "en", name: "English" },
  { code: "es", name: "Spanish" },
  { code: "fr", name: "French" },
  { code: "de", name: "German" },
  { code: "it", name: "Italian" },
  { code: "pt", name: "Portuguese" },
  { code: "ru", name: "Russian" },
  { code: "zh", name: "Chinese" },
  { code: "ja", name: "Japanese" },
  { code: "ko", name: "Korean" },
];

type CreateArticleModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (translations: { [key: string]: ArticleTranslation }) => void;
};

export function CreateArticleModal({
  isOpen,
  onClose,
  onSave,
}: CreateArticleModalProps) {
  const { t } = useTranslation();
  const [activeLanguage, setActiveLanguage] = useState(languages[0].code);
  const [translations, setTranslations] = useState<{
    [key: string]: ArticleTranslation;
  }>({});
  const [articleCategory, setArticleCategory] = useState("general");

  const handleSave = () => {
    onSave(translations);
    onClose();
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Content style={{ maxWidth: 800 }}>
        <Dialog.Title>{t("articles.create.title")}</Dialog.Title>
        <LanguageTabsSection
          languages={languages}
          activeLanguage={activeLanguage}
          setActiveLanguage={setActiveLanguage}
          translations={translations}
          setTranslations={setTranslations}
          articleCategory={articleCategory}
          setArticleCategory={setArticleCategory}
        />
        <Flex gap="3" mt="4" justify="end">
          <Dialog.Close>
            <Button variant="soft" color="gray">
              {t("common.cancel")}
            </Button>
          </Dialog.Close>
          <Button onClick={handleSave}>{t("articles.create.save")}</Button>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
}
