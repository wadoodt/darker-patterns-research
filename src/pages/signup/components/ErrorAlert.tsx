import React from "react";
import { Terminal } from "lucide-react";

type ErrorAlertProps = {
  error: string | null;
  t: (key: string, options?: Record<string, unknown>) => string;
};

const ErrorAlert: React.FC<ErrorAlertProps> = ({ error, t }) => {
  if (!error) return null;
  return (
    <div
      style={{
        background: "#ffeaea",
        borderRadius: 6,
        padding: 12,
        marginBottom: 16,
        display: "flex",
        alignItems: "center",
        gap: 8,
        color: "#b00020",
      }}
    >
      <Terminal size={18} />
      <div>
        <strong>{t("auth.signup.alerts.error.title")}</strong>
        <div>{error}</div>
      </div>
    </div>
  );
};

export default ErrorAlert;
