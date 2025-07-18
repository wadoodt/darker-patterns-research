import React from "react";
import { Card } from "@radix-ui/themes";
import { Check } from "lucide-react";
import type { TFunction } from "i18next";

type PlanCardProps = {
  planKey: string;
  icon: React.ReactNode;
  t: TFunction;
  featuresArray?: string[];
};

const PlanCard: React.FC<PlanCardProps> = ({
  planKey,
  icon,
  t,
  featuresArray,
}) => (
  <Card className="min-w-[320px] max-w-[360px] flex-1">
    <div className="px-6 pt-6 pb-2">
      {icon}
      <h2 className="text-xl font-bold">
        {t(`pricing.plans.${planKey}.title`)}
      </h2>
      <p className="mb-2">{t(`pricing.plans.${planKey}.description`)}</p>
      <div className="text-3xl font-bold mt-2">
        {t(`pricing.plans.${planKey}.price`)}
        {planKey !== "custom" && (
          <span className="text-base font-normal text-gray-500 ml-1">
            {t(`pricing.plans.${planKey}.interval`)}
          </span>
        )}
      </div>
    </div>
    <div className="px-6">
      <ul className="pl-0 list-none">
        {featuresArray ? (
          featuresArray.map((feature, idx) => (
            <li key={idx} className="flex items-center mb-1">
              <Check size={16} className="mr-2 text-green-600" /> {feature}
            </li>
          ))
        ) : (
          <li>No features listed.</li>
        )}
      </ul>
    </div>
    <div className="p-6">
      {planKey !== "custom" ? (
        <a
          href={`/signup?plan=${planKey}`}
          className="block w-full text-center py-3 bg-black text-white rounded-md no-underline font-semibold"
          tabIndex={0}
          aria-label={t(`pricing.plans.${planKey}.ctaText`)}
        >
          {t(`pricing.plans.${planKey}.ctaText`)}
        </a>
      ) : (
        <a
          href="/contact"
          className="block w-full text-center py-3 border border-black text-black rounded-md no-underline font-semibold"
          tabIndex={0}
          aria-label={t("pricing.plans.custom.ctaText")}
        >
          {t("pricing.plans.custom.ctaText")}
        </a>
      )}
    </div>
  </Card>
);

export default PlanCard;
