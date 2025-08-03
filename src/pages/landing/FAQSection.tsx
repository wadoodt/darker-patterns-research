import React from "react";
import { useTranslation } from "react-i18next";
import { useFaqs } from "@api/domains/faq/hooks";
import type { FaqItem } from "@api/domains/faq/types";

const FAQSection: React.FC = () => {
  const { t, i18n } = useTranslation();
  const {
    data ,
    loading: isLoading,
    error,
  } = useFaqs({ category: "home" });

  const faqs = React.useMemo(() => data?.faqs || [], [data]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error fetching FAQs</div>;

  const currentLanguage = i18n.language;

  return (
    <section className="faq-section" id="faq">
      <h2>{t("pricing.faq.title")}</h2>
      <div className="faq-list">
        {faqs?.map((faq: FaqItem) => {
          const translation = faq.translations[currentLanguage] ?? faq.translations.en;
          return (
            <div key={faq.id} className="faq-item">
              <h3>{translation.question}</h3>
              <p>{translation.answer}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default FAQSection;
