
import {
  Flex,
  Tabs,
  TextField,
  TextArea,
  Select,
} from "@radix-ui/themes";
import type { ArticleTranslation } from "@api/domains/knowledge-base/types";

type LanguageTabsSectionProps = {
  languages: { code: string; name: string }[];
  activeLanguage: string;
  setActiveLanguage: (language: string) => void;
  translations: { [key: string]: ArticleTranslation };
  setTranslations: (
    translations:
      | { [key: string]: ArticleTranslation }
      | ((
          prev: { [key: string]: ArticleTranslation },
        ) => { [key: string]: ArticleTranslation }),
  ) => void;
  articleCategory: string;
  setArticleCategory: (category: string) => void;
};

export function LanguageTabsSection({
  languages,
  activeLanguage,
  setActiveLanguage,
  translations,
  setTranslations,
  articleCategory,
  setArticleCategory,
}: LanguageTabsSectionProps) {
  const handleTranslationChange = (
    field: keyof ArticleTranslation,
    value: string,
  ) => {
    setTranslations((prev) => ({
      ...prev,
      [activeLanguage]: {
        ...prev[activeLanguage],
        [field]: value,
      },
    }));
  };

  return (
    <Tabs.Root
      defaultValue={activeLanguage}
      onValueChange={setActiveLanguage}
      style={{ marginTop: 20 }}
    >
      <Tabs.List>
        {languages.map(({ code, name }) => (
          <Tabs.Trigger key={code} value={code}>
            {name}
          </Tabs.Trigger>
        ))}
      </Tabs.List>
      <Flex direction="column" gap="3" pt="3">
        <TextField.Root
          placeholder="Title"
          value={translations[activeLanguage]?.title || ""}
          onChange={(e) => handleTranslationChange("title", e.target.value)}
        />
        <TextArea
          placeholder="Description"
          value={translations[activeLanguage]?.description || ""}
          onChange={(e) =>
            handleTranslationChange("description", e.target.value)
          }
        />
        <TextArea
          placeholder="Body"
          value={translations[activeLanguage]?.body || ""}
          rows={10}
          onChange={(e) => handleTranslationChange("body", e.target.value)}
        />
        <Select.Root
          value={articleCategory}
          onValueChange={setArticleCategory}
        >
          <Select.Trigger placeholder="Category" />
          <Select.Content>
            <Select.Item value="general">General</Select.Item>
            <Select.Item value="billing">Billing</Select.Item>
            <Select.Item value="technical">Technical</Select.Item>
          </Select.Content>
        </Select.Root>
      </Flex>
    </Tabs.Root>
  );
}
