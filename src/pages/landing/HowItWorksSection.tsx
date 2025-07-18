import React from "react";
import { useTranslation } from "react-i18next";
import { EnvelopeClosedIcon, LayoutIcon, BarChartIcon } from "@radix-ui/react-icons";

const stepsIcons = [EnvelopeClosedIcon, LayoutIcon, BarChartIcon];

const HowItWorksSection: React.FC = () => {
  const { t } = useTranslation();
  // Example steps, replace with i18n content as needed
  const steps = [
    { title: t("pricing.plans.business.title"), description: t("pricing.plans.business.description") },
    { title: t("pricing.plans.premium.title"), description: t("pricing.plans.premium.description") },
    { title: t("pricing.plans.custom.title"), description: t("pricing.plans.custom.description") },
  ];
  return (
    <section className="how-it-works-section" id="how-it-works">
      <h2>{t("pricing.faq.title")}</h2>
      <div className="how-it-works-steps">
        {steps.map((step, idx) => {
          const Icon = stepsIcons[idx];
          return (
            <div className="how-it-works-step" key={idx}>
              <Icon width={32} height={32} aria-hidden="true" />
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default HowItWorksSection; 