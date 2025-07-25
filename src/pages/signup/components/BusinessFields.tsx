import React from "react";
import { Building } from "lucide-react";

type BusinessFieldsProps = {
  signupType: "new" | "existing";
  businessName: string;
  setBusinessName: (v: string) => void;
  businessId: string;
  setBusinessId: (v: string) => void;
  referralCode: string;
  setReferralCode: (v: string) => void;
  t: (key: string, options?: Record<string, unknown>) => string;
};

const BusinessFields: React.FC<BusinessFieldsProps> = ({
  signupType,
  businessName,
  setBusinessName,
  businessId,
  setBusinessId,
  referralCode,
  setReferralCode,
  t,
}) => (
  <>
    {signupType === "new" && (
      <div style={{ marginBottom: 16 }}>
        <label htmlFor="businessName">
          {t("auth.signup.form.labels.businessName")}
        </label>
        <input
          id="businessName"
          type="text"
          required
          value={businessName}
          onChange={(e) => setBusinessName(e.target.value)}
          style={{
            width: "100%",
            padding: 8,
            borderRadius: 6,
            border: "1px solid #ccc",
          }}
        />
      </div>
    )}
    {signupType === "existing" && (
      <>
        <div style={{ marginBottom: 16 }}>
          <label htmlFor="businessId">
            {t("auth.signup.form.labels.businessId")}
          </label>
          <input
            id="businessId"
            type="text"
            required
            value={businessId}
            onChange={(e) => setBusinessId(e.target.value)}
            style={{
              width: "100%",
              padding: 8,
              borderRadius: 6,
              border: "1px solid #ccc",
            }}
          />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label htmlFor="referralCode">
            {t("auth.signup.form.labels.referralCode")}
          </label>
          <input
            id="referralCode"
            type="text"
            required
            value={referralCode}
            onChange={(e) => setReferralCode(e.target.value)}
            style={{
              width: "100%",
              padding: 8,
              borderRadius: 6,
              border: "1px solid #ccc",
            }}
          />
        </div>
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
          <Building size={18} />
          <div>
            <strong>{t("auth.signup.alerts.joining.title")}</strong>
            <div>{t("auth.signup.alerts.joining.description")}</div>
          </div>
        </div>
      </>
    )}
  </>
);

export default BusinessFields;
