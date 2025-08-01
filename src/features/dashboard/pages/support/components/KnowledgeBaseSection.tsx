
import React, { useState } from "react";
import type { KnowledgeBaseArticle } from "@api/domains/knowledge-base/types";
import { useTranslation } from "react-i18next";
import { TextField, Flex, Text, Link } from "@radix-ui/themes";
import { MagnifyingGlassIcon, ExternalLinkIcon } from "@radix-ui/react-icons";
import { getLanguage } from "@locales/i18n";

type KnowledgeBaseSectionProps = {
  articles: KnowledgeBaseArticle[];
};

export function KnowledgeBaseSection({
  articles,
}: KnowledgeBaseSectionProps) {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const lang = getLanguage();

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filteredArticles = articles.filter((article) => {
    const translation = article.translations[lang] || article.translations.en;
    return (
      translation.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      translation.description
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="support-section">
      <h3 className="support-section-title">
        {t("support.knowledgeBase.title")}
      </h3>
      <Text as="p" size="2" color="gray" className="support-section-subtitle">
        {t("support.knowledgeBase.subtitle")}
      </Text>
      <TextField.Root
        placeholder={t("support.knowledgeBase.search.placeholder")}
        value={searchTerm}
        onChange={handleSearchChange}
        mb="4"
      >
        <TextField.Slot>
          <MagnifyingGlassIcon height="16" width="16" />
        </TextField.Slot>
      </TextField.Root>
      <Flex direction="column" gap="3">
        {filteredArticles.map((article) => {
          const translation =
            article.translations[lang] || article.translations.en;
          return (
            <Link
              key={article.id}
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="support-link"
            >
              {translation.title}
              <ExternalLinkIcon />
            </Link>
          );
        })}
      </Flex>
    </div>
  );
}
