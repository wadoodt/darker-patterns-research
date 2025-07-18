import React from "react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@radix-ui/react-accordion";
import { HelpCircle } from "lucide-react";
import type { TFunction } from "i18next";

type FAQSectionProps = {
  t: TFunction;
};

const FAQSection: React.FC<FAQSectionProps> = ({ t }) => {
  const faqItems = t("pricing.faq.items", { returnObjects: true });
  const faqArray = Array.isArray(faqItems)
    ? (faqItems as { question: string; answer: string }[])
    : undefined;

  return (
    <section className="py-12 bg-gray-50">
      <h2 className="text-center mb-8 text-2xl font-bold">
        {t("pricing.faq.title")}
      </h2>
      <div className="max-w-xl mx-auto">
        {faqArray ? (
          <Accordion type="single" collapsible>
            {faqArray.map((item, idx) => (
              <AccordionItem key={idx} value={`item-${idx}`}>
                <AccordionTrigger className="flex items-center gap-2 font-medium">
                  <HelpCircle size={18} /> {item.question}
                </AccordionTrigger>
                <AccordionContent>
                  <div className="py-4">{item.answer}</div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        ) : (
          <div>No FAQ items found.</div>
        )}
      </div>
    </section>
  );
};

export default FAQSection;
