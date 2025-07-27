import React from "react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@radix-ui/react-accordion";
import { HelpCircle } from "lucide-react";
import type { TFunction } from "i18next";

import { useAsyncCache } from "@hooks/useAsyncCache";
import api from "@api/client";
import type { FAQItem } from "types/faq";
import { CacheLevel } from "@lib/cache/types";
import { getLanguage } from "@locales/i18n";

type FAQSectionProps = {
  t: TFunction;
};

const FAQSection: React.FC<FAQSectionProps> = ({ t }) => {
  const { data: faqItems, loading } = useAsyncCache<FAQItem[]>(
    ['pricing-faqs'],
    async () => {
      const response = await api.get<FAQItem[]>('/faqs?category=pricing');
      return response.data;
    },
    CacheLevel.PERSISTENT
  );

  const currentLanguage = getLanguage();

  return (
    <section className="py-12 bg-gray-50">
      <h2 className="text-center mb-8 text-2xl font-bold">
        {t("pricing.faq.title")}
      </h2>
      <div className="max-w-xl mx-auto">
        {loading ? (
          <div className="flex justify-center">Loading FAQs...</div>
        ) : faqItems && faqItems.length > 0 ? (
          <Accordion type="single" collapsible>
            {faqItems.map((item: FAQItem, idx: number) => {
              const translation = item.translations[currentLanguage] || item.translations.en;
              return (
                <AccordionItem key={idx} value={`item-${idx}`}>
                  <AccordionTrigger className="flex items-center gap-2 font-medium">
                    <HelpCircle size={18} /> {translation.question}
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="py-4">{translation.answer}</div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        ) : (
          <div>No FAQ items found.</div>
        )}
      </div>
    </section>
  );
};

export default FAQSection;
