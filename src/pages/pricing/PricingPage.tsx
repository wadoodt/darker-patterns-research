import React from "react";
import { useTranslation } from "react-i18next";
import { Briefcase, Star, MailQuestion } from "lucide-react";
import PlanCard from "./components/PlanCard";
import FAQSection from "./components/FAQSection";

export default function PricingPage() {
  const { t } = useTranslation();
  const plans = ["business", "premium", "custom"] as const;
  const icons: Record<string, React.ReactNode> = {
    business: <Briefcase size={32} className="mb-2" />,
    premium: <Star size={32} className="mb-2" />,
    custom: <MailQuestion size={32} className="mb-2" />,
  };

  return (
    <main>
      {/* Hero Section */}
      <section className="py-12 text-center">
        <h1 className="text-3xl font-bold mb-2">{t("pricing.hero.title")}</h1>
        <p className="text-lg text-gray-600">{t("pricing.hero.description")}</p>
      </section>

      {/* Plans Grid */}
      <section className="flex justify-center gap-8 flex-wrap mb-12">
        {plans.map((planKey) => {
          const features = t(`pricing.plans.${planKey}.features`, {
            returnObjects: true,
          });
          const featuresArray = Array.isArray(features)
            ? (features as string[])
            : undefined;
          return (
            <PlanCard
              key={planKey}
              planKey={planKey}
              icon={icons[planKey]}
              t={t}
              featuresArray={featuresArray}
            />
          );
        })}
      </section>

      {/* FAQ Section */}
      <FAQSection t={t} />
    </main>
  );
}
