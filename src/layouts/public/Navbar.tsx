import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Cross1Icon, HamburgerMenuIcon } from "@radix-ui/react-icons";
import styles from "./Navbar.module.css";
import { useApp } from "@hooks/useApp";
import { useAuth } from "@contexts/AuthContext";
import clsx from "clsx";

const Navbar: React.FC = () => {
  const { t } = useTranslation();
  const { settings } = useApp();
  const { user } = useAuth();
  const [isMenuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!isMenuOpen);

  const navLinks = (
    <>
      <li>
        <a href="/pricing" aria-label={t("pricing.hero.title")}>
          {t("pricing.hero.title")}
        </a>
      </li>
      {user ? (
        <li>
          <a href="/dashboard" aria-label="Go to Dashboard">
            Go to Dashboard
          </a>
        </li>
      ) : (
        <>
          <li>
            <a href="/login" aria-label={t("auth.login.title")}>
              {t("auth.login.title")}
            </a>
          </li>
          <li>
            <a
              href="/signup"
              className={styles.signup}
              aria-label={t("auth.login.signUp")}
            >
              {t("auth.login.signUp")}
            </a>
          </li>
        </>
      )}
    </>
  );

  const navbarClasses = clsx(styles.navbar, {
    [styles.stickyLight]: settings.theme === "light",
    [styles.stickyDark]: settings.theme === "dark",
    [styles.stickyContrast]: settings.theme.startsWith("high-contrast"),
  });

  return (
    <>
      <nav className={navbarClasses} aria-label="Main navigation">
        <div className={styles.inner}>
          <a href="/" className={styles.logo} aria-label="Home">
            <img
              src="/images/penguin_logo_placeholder.png"
              alt="Penguin Mails Logo"
            />
          </a>
          <ul className={styles.links}>{navLinks}</ul>
          <button
            className={styles.mobileMenuButton}
            onClick={toggleMenu}
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <Cross1Icon /> : <HamburgerMenuIcon />}
          </button>
        </div>
      </nav>
      {isMenuOpen && (
        <div className={styles.mobileMenu}>
          <ul onClick={() => setMenuOpen(false)}>{navLinks}</ul>
        </div>
      )}
    </>
  );
};

export default Navbar;