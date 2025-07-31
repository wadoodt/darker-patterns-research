import React from "react";
import * as Accordion from "@radix-ui/react-accordion";
import { QuestionMarkCircledIcon } from "@radix-ui/react-icons";
import { useAsyncCache } from "@hooks/useAsyncCache";
import api from "@api/client";
import type { FAQItem } from "types/faq";
import { getLanguage } from "@locales/i18n";
import { CACHE_TTL } from "@lib/cache/constants";
import { Text, useTranslations } from "@radix-ui/themes";

const FAQSection: React.FC = () => {
  const t = useTranslations();
  const {
    data: faqs,
    loading,
    error,
  } = useAsyncCache<FAQItem[]>(
    ["faqs", "home"],
    async () => {
      const { data } = await api.get<{ data: FAQItem[] }>(
        "/faqs?category=home",
      );
      return data.data;
    },
    { ttl: CACHE_TTL.LONG_1_DAY },
  );

  if (loading) {
    return (
      <section className="faq-section" id="faq">
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
    <section className="faq-section" id="faq">
      <h2>{t("pricing.faq.title")}</h2>
      <Accordion.Root type="single" collapsible className="faq-accordion">
        {faqs.map((faq) => {
          const translation =
            faq.translations[currentLanguage] || faq.translations.en;
          return (
            <Accordion.Item value={faq.id} key={faq.id} className="faq-item">
              <Accordion.Header>
                <Accordion.Trigger className="faq-trigger">
                  <QuestionMarkCircledIcon
                    aria-hidden="true"
                    style={{ marginRight: 8 }}
                  />
                  {translation.question}
                </Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Content className="faq-content">
                {translation.answer}
              </Accordion.Content>
            </Accordion.Item>
          );
        })}
      </Accordion.Root>
    </section>
  );
};

export default FAQSection;
