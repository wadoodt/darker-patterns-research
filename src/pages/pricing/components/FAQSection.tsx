import React from "react";
import { useTranslation } from "react-i18next";
import * as Accordion from "@radix-ui/react-accordion";
import { QuestionMarkCircledIcon } from "@radix-ui/react-icons";
import { useFaqs } from "@api/domains/faq/hooks";
import type { FaqItem } from "@api/domains/faq/types";
import { getLanguage } from "@locales/i18n";
import { Text } from "@radix-ui/themes";

const FAQSection: React.FC = () => {
  const { t } = useTranslation();
  const {
    data,
    loading: isLoading,
    error,
  } = useFaqs({ category: "pricing" });

  const faqs = React.useMemo(() => data?.faqs || [], [data]);

  if (isLoading) {
    return (
      <section className="py-12 bg-gray-50">
        <h2>{t("pricing.faq.title")}</h2>
        <Text>{t("common.loading")}</Text>
      </section>
    );
  }

  if (error || !faqs || faqs.length === 0) {
    return null;
  }

  const currentLanguage = getLanguage() as "en" | "es";

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">
          {t("pricing.faq.title")}
        </h2>
        <div className="max-w-xl mx-auto">
          <Accordion.Root type="single" collapsible className="faq-accordion">
            {faqs.map((faq: FaqItem) => {
              const translation =
                faq.translations[currentLanguage] || faq.translations.en;
              return (
                <Accordion.Item value={faq.id} key={faq.id} className="faq-item">
                  <Accordion.Header className="faq-header">
                    <Accordion.Trigger className="flex items-center gap-2 font-medium">
                      <QuestionMarkCircledIcon width={18} height={18} /> {translation.question}
                    </Accordion.Trigger>
                  </Accordion.Header>
                  <Accordion.Content className="faq-content">
                    {translation.answer}
                  </Accordion.Content>
                </Accordion.Item>
              );
            })}
          </Accordion.Root>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
