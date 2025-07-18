import React from "react";

type FooterLoginProps = {
  t: (key: string, options?: Record<string, unknown>) => string;
};

const FooterLogin: React.FC<FooterLoginProps> = ({ t }) => (
  <div
    style={{ textAlign: "center", marginTop: 16, fontSize: 14, color: "#666" }}
  >
    {t("signup.footer.haveAccount")}{" "}
    <a
      href="/login"
      style={{ color: "#111", textDecoration: "underline", fontWeight: 500 }}
    >
      {t("signup.footer.login")}
    </a>
  </div>
);

export default FooterLogin;
