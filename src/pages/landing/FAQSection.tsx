import React from "react";
import { useTranslation } from "react-i18next";
import { Text } from "@radix-ui/themes";
import * as Accordion from "@radix-ui/react-accordion";
import { QuestionMarkCircledIcon } from "@radix-ui/react-icons";
import { useEffect, useState } from "react";
import api from "@api/client";
import type { FAQItem } from "types/faq";

const FAQSection: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFAQs = async () => {
      try {
        setLoading(true);
        const response = await api.get<FAQItem[]>("/faqs?category=pricing");
        setFaqs(response.data);
      } catch (error) {
        console.error("Failed to fetch FAQs", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFAQs();
  }, []);

  if (loading) {
    return (
      <section className="faq-section" id="faq">
        <h2>{t("pricing.faq.title")}</h2>
        <Text>{t("common.loading")}</Text>
      </section>
    );
  }

  if (!faqs || faqs.length === 0) {
    return null;
  }

  const currentLanguage = i18n.language as 'en' | 'es';

  return (
    <section className="faq-section" id="faq">
      <h2>{t("pricing.faq.title")}</h2>
      <Accordion.Root type="single" collapsible className="faq-accordion">
        {faqs.map((faq) => {
          const translation = faq.translations[currentLanguage] || faq.translations.en;
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
