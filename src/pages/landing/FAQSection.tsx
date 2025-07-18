import React from "react";
import { useTranslation } from "react-i18next";
import * as Accordion from "@radix-ui/react-accordion";
import { QuestionMarkCircledIcon } from "@radix-ui/react-icons";

const FAQSection: React.FC = () => {
  const { t } = useTranslation();
  // Example: get FAQ items from i18n
  const faqs = t("pricing.faq.items", { returnObjects: true }) as Array<{ question: string; answer: string }>;
  return (
    <section className="faq-section" id="faq">
      <h2>{t("pricing.faq.title")}</h2>
      <Accordion.Root type="single" collapsible className="faq-accordion">
        {faqs.map((faq, idx) => (
          <Accordion.Item value={`item-${idx}`} key={idx} className="faq-item">
            <Accordion.Header>
              <Accordion.Trigger className="faq-trigger">
                <QuestionMarkCircledIcon aria-hidden="true" style={{ marginRight: 8 }} />
                {faq.question}
              </Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content className="faq-content">{faq.answer}</Accordion.Content>
          </Accordion.Item>
        ))}
      </Accordion.Root>
    </section>
  );
};

export default FAQSection; 