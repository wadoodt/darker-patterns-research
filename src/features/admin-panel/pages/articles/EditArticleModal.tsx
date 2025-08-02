
import { useState, useEffect } from "react";
import type { KnowledgeBaseArticle } from "@api/domains/knowledge-base/types";
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

type EditArticleModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (article: KnowledgeBaseArticle) => void;
  article: KnowledgeBaseArticle | null;
};

export function EditArticleModal({
  isOpen,
  onClose,
  onSave,
  article,
}: EditArticleModalProps) {
  const { t } = useTranslation();
  const [activeLanguage, setActiveLanguage] = useState(languages[0].code);
  const [translations, setTranslations] = useState(
    article?.translations || {},
  );
  const [articleCategory, setArticleCategory] = useState(
    article?.category || "general",
  );

  useEffect(() => {
    if (article) {
      setTranslations(article.translations);
      setArticleCategory(article.category);
    }
  }, [article]);

  const handleSave = () => {
    if (article) {
      onSave({
        ...article,
        category: articleCategory,
        translations,
      });
    }
    onClose();
  };

  if (!article) return null;

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Content style={{ maxWidth: 800 }}>
        <Dialog.Title>
          {t("articles.editArticle")}
        </Dialog.Title>
        <Dialog.Description>
          {t("articles.editArticleDescription")}
        </Dialog.Description>
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
          <Button onClick={handleSave}>{t("common.save")}</Button>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
}
