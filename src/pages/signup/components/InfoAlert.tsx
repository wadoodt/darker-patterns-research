import React from "react";
import { KeyRound } from "lucide-react";

type InfoAlertProps = {
  show: boolean;
  selectedPlan: string;
  getPlanLabel: (planKey: string) => string;
  t: (key: string, options?: Record<string, unknown>) => string;
};

const InfoAlert: React.FC<InfoAlertProps> = ({
  show,
  selectedPlan,
  getPlanLabel,
  t,
}) => {
  if (!show || !selectedPlan) return null;
  return (
    <div
      style={{
        background: "#f6f6f6",
        borderRadius: 6,
        padding: 12,
        marginBottom: 16,
        display: "flex",
        alignItems: "center",
        gap: 8,
      }}
    >
      <KeyRound size={18} />
      <div>
        <strong>{t("signup.alerts.newAccount.title")}</strong>
        <div>
          {t("signup.alerts.newAccount.description", {
            plan: getPlanLabel(selectedPlan),
          })}
        </div>
      </div>
    </div>
  );
};

export default InfoAlert;
