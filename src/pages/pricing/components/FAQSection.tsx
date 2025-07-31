import React from "react";
import * as Accordion from "@radix-ui/react-accordion";
import { HelpCircle } from "lucide-react";
import type { TFunction } from "i18next";

import { useAsyncCache } from "@hooks/useAsyncCache";
import api from "@api/client";
import type { FAQItem } from "types/faq";
import { CACHE_TTL } from "@lib/cache/constants";
import { getLanguage } from "@locales/i18n";

type FAQSectionProps = {
  t: TFunction;
};

const FAQSection: React.FC<FAQSectionProps> = ({ t }) => {
  const { data: faqItems, loading } = useAsyncCache<FAQItem[]>(
    ["faqs", "pricing"],
    async () => {
      const { data } = await api.get<{ data: FAQItem[] }>(
        "/faqs?category=pricing",
      );
      console.log({ data });
      return data.data;
    },
    { ttl: CACHE_TTL.LONG_1_DAY },
  );

  const currentLanguage = getLanguage();

  return (
    <section className="py-12 bg-gray-50">
      <h2 className="text-center mb-8 text-2xl font-bold">
        {t("pricing.faq.title")}
      </h2>
      <div className="max-w-xl mx-auto">
        {loading ? (
          <div className="flex justify-center">{t("pricing.faq.loading")}</div>
        ) : faqItems && faqItems.length > 0 ? (
          <Accordion.Root type="single" collapsible>
            {faqItems.map((item: FAQItem, idx: number) => {
              const translation =
                item.translations[currentLanguage] || item.translations.en;
              return (
                <Accordion.Item key={idx} value={`item-${idx}`}>
                  <Accordion.Header>
                    <Accordion.Trigger className="flex items-center gap-2 font-medium">
                      <HelpCircle size={18} /> {translation.question}
                    </Accordion.Trigger>
                  </Accordion.Header>
                  <Accordion.Content>
                    <div className="py-4">{translation.answer}</div>
                  </Accordion.Content>
                </Accordion.Item>
              );
            })}
          </Accordion.Root>
        ) : (
          <div>{t("pricing.faq.empty")}</div>
        )}
      </div>
    </section>
  );
};

export default FAQSection;
