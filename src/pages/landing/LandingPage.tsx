import React from "react";
import { useTranslation } from 'react-i18next';
import HeroSection from "./HeroSection";
import HowItWorksSection from "./HowItWorksSection";
import FAQSection from "./FAQSection";

const LandingPage: React.FC = () => {
  useTranslation(); // Ensures i18n is initialized for this page
  return (
    <>
      <HeroSection />
      <HowItWorksSection />
      <FAQSection />
    </>
  );
};

export default LandingPage;

