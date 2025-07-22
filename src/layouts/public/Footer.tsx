import React from "react";
import { useTranslation } from "react-i18next";
import styles from "./Footer.module.css";

const Footer: React.FC = () => {
  const { t } = useTranslation();
  return (
    <footer className={styles.footer} aria-label="Footer">
      <div className={styles.inner}>
        <span>&copy; {new Date().getFullYear()} Penguin Mails</span>
        <nav aria-label="Footer links">
          <a href="/pricing">{t("pricing.hero.title")}</a>
          <a href="/login">{t("signup.footer.login")}</a>
          <a href="/signup">{t("signup.header.title")}</a>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;
