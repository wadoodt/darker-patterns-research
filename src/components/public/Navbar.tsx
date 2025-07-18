import React from "react";
import { useTranslation } from "react-i18next";

const Navbar: React.FC = () => {
  const { t } = useTranslation();
  return (
    <nav className="landing-navbar" aria-label="Main navigation">
      <div className="landing-navbar-inner">
        <a href="/" className="landing-navbar-logo" aria-label="Home">
          <img src="/images/penguin_logo_placeholder.png" alt="Penguin Mails Logo" height={40} />
        </a>
        <ul className="landing-navbar-links">
          <li><a href="/pricing" aria-label={t("pricing.hero.title")}>{t("pricing.hero.title")}</a></li>
          <li><a href="/login" aria-label={t("signup.footer.login")}>{t("signup.footer.login")}</a></li>
          <li><a href="/signup" className="landing-navbar-signup" aria-label={t("signup.header.title")}>{t("signup.header.title")}</a></li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar; 