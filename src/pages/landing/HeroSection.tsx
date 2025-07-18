import React from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@radix-ui/themes";
import { ArrowRightCircle } from "lucide-react";
import { FloatingMailsContainer } from "./FloatingMailsContainer";

const HeroSection: React.FC = () => {
  const { t } = useTranslation();
  return (
    <section className="hero-section">
      <FloatingMailsContainer />
      <div className="hero-content-outer">
        <div className="hero-content-inner">
          <h1 className="hero-title">
            {t("pricing.hero.title")} <span className="hero-title-accent">Penguin Mails</span>
          </h1>
          <p className="hero-description">{t("pricing.hero.description")}</p>
          <div className="hero-buttons-row">
            <Button asChild size="3">
              <a href="/signup" aria-label={t("signup.header.title")}>{t("pricing.plans.business.ctaText")}</a>
            </Button>
            <Button asChild variant="outline" size="3" className="hero-outline-btn">
              <a href="#how-it-works" aria-label={t("pricing.faq.title")}
                className="hero-outline-link">
                <ArrowRightCircle size={20} style={{ marginRight: 8 }} />
                {t("pricing.faq.title")}
              </a>
            </Button>
          </div>
        </div>
        <div className="hero-mockup-row">
          <div className="hero-mockup-card">
            <div className="hero-mockup-bar">
              <span className="hero-dot hero-dot-red" />
              <span className="hero-dot hero-dot-yellow" />
              <span className="hero-dot hero-dot-green" />
              <p className="hero-mockup-link">penguinmails.app</p>
            </div>
            <img
              src="/images/email_placeholder.png"
              alt="App Mockup"
              width={600}
              height={360}
              className="hero-mockup-img"
              style={{ width: "100%", height: "auto" }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection; 