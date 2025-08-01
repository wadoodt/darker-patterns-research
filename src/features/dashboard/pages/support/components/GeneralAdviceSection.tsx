
import type { KnowledgeBaseArticle } from "@api/domains/knowledge-base/types";
import { Trans, useTranslation } from "react-i18next";
import { Link, Text } from "@radix-ui/themes";
import { ExternalLinkIcon } from "@radix-ui/react-icons";
import { getLanguage } from "@locales/i18n";

type GeneralAdviceSectionProps = {
  articles: KnowledgeBaseArticle[];
};

export function GeneralAdviceSection({
  articles,
}: GeneralAdviceSectionProps) {
  const { t } = useTranslation();
  const lang = getLanguage();
  const generalArticles = articles.filter(
    (article) => article.category === "general",
  );

  return (
    <div className="support-section">
      <h3 className="support-section-title">{t("support.generalAdvice")}</h3>
      <Text as="p" size="2" color="gray" className="support-section-subtitle">
        <Trans
          t={t}
          i18nKey="support.generalAdvice.subtitle"
          components={{
            strong: <strong />,
          }}
        />
      </Text>
      <div className="support-links-grid">
        {generalArticles.map((article) => {
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
      </div>
    </div>
  );
}
