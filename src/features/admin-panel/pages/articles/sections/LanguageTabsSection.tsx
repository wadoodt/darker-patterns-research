import React from "react";
import { Tabs, Box, TextField, TextArea } from "@radix-ui/themes";
import type { Translation, KnowledgeBaseArticle } from "types/knowledge-base";

interface LanguageTabsSectionProps {
  form?: { en: Translation; es: Translation };
  editingArticle?: KnowledgeBaseArticle | null;
  activeLang: "en" | "es";
  setActiveLang: (lang: "en" | "es") => void;
  handleFieldChange: (lang: "en" | "es", field: keyof Translation, value: string) => void;
  t: (key: string) => string;
}

export const LanguageTabsSection: React.FC<LanguageTabsSectionProps> = ({
  form,
  editingArticle,
  activeLang,
  setActiveLang,
  handleFieldChange,
  t,
}) => {
  const getValue = (lang: "en" | "es", field: keyof Translation) => {
    if (editingArticle) return editingArticle.translations[lang][field];
    if (form) return form[lang][field];
    return "";
  };
  return (
    <Tabs.Root value={activeLang} onValueChange={(v) => setActiveLang(v as "en" | "es")}> 
      <Tabs.List>
        <Tabs.Trigger value="en">{t("articlesPage.english")}</Tabs.Trigger>
        <Tabs.Trigger value="es">{t("articlesPage.spanish")}</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="en">
        <Box my="4">
          <TextField.Root
            placeholder={t("articlesPage.title")}
            value={getValue("en", "title")}
            onChange={(e) => handleFieldChange("en", "title", e.target.value)}
            mb="2"
          />
          <TextField.Root
            placeholder={t("articlesPage.category")}
            value={getValue("en", "category")}
            onChange={(e) => handleFieldChange("en", "category", e.target.value)}
            mb="2"
          />
          <TextField.Root
            placeholder={t("articlesPage.description")}
            value={getValue("en", "description")}
            onChange={(e) => handleFieldChange("en", "description", e.target.value)}
            mb="2"
          />
          <TextArea
            placeholder={t("articlesPage.body")}
            value={getValue("en", "body")}
            onChange={(e) => handleFieldChange("en", "body", e.target.value)}
            rows={6}
          />
        </Box>
      </Tabs.Content>
      <Tabs.Content value="es">
        <Box my="4">
          <TextField.Root
            placeholder={t("articlesPage.title")}
            value={getValue("es", "title")}
            onChange={(e) => handleFieldChange("es", "title", e.target.value)}
            mb="2"
          />
          <TextField.Root
            placeholder={t("articlesPage.category")}
            value={getValue("es", "category")}
            onChange={(e) => handleFieldChange("es", "category", e.target.value)}
            mb="2"
          />
          <TextField.Root
            placeholder={t("articlesPage.description")}
            value={getValue("es", "description")}
            onChange={(e) => handleFieldChange("es", "description", e.target.value)}
            mb="2"
          />
          <TextArea
            placeholder={t("articlesPage.body")}
            value={getValue("es", "body")}
            onChange={(e) => handleFieldChange("es", "body", e.target.value)}
            rows={6}
          />
        </Box>
      </Tabs.Content>
    </Tabs.Root>
  );
}; 