import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// Import English translations
import enShared from "./en/shared.json";
import enUI from "./en/ui.json";
import enAPI from "./en/api.json";
import enAuth from "./en/pages/auth.json";
import enTeam from "./en/pages/team.json";
import enSettings from "./en/pages/settings.json";
import enSupport from "./en/pages/support.json";
import enPricing from "./en/pages/pricing.json";
import enTickets from "./en/pages/tickets.json";
import enProfile from "./en/pages/profile.json";
import enSidebar from "./en/sidebar.json";
import enResponse from "./en/response.json";
import enError from "./en/error.json";
import enPagination from "./en/pagination.json";
import enArticles from "./en/pages/articles.json";
import enCommon from './en/common.json';
import enConfig from './en/pages/config.json';

// Import Spanish translations
import esShared from "./es/shared.json";
import esUI from "./es/ui.json";
import esAPI from "./es/api.json";
import esAuth from "./es/pages/auth.json";
import esTeam from "./es/pages/team.json";
import esSettings from "./es/pages/settings.json";
import esSupport from "./es/pages/support.json";
import esPricing from "./es/pages/pricing.json";
import esTickets from "./es/pages/tickets.json";
import esProfile from "./en/pages/profile.json";
import esArticles from "./es/pages/articles.json";
import esSidebar from "./es/sidebar.json";
import esResponse from "./es/response.json";
import esError from "./es/error.json";
import esPagination from "./es/pagination.json";
import esCommon from './es/common.json';
import esConfig from './es/pages/config.json';

export const fallbackLanguage = "en";

// Combine translations
const resources = {
  en: {
    translation: {
      ...enShared,
      ...enUI,
      ...enAPI,
      common: enCommon,
      sidebar: enSidebar,
      response: enResponse,
      error: enError,
      pagination: enPagination,
      auth: enAuth,
      team: enTeam,
      settings: enSettings,
      support: enSupport,
      pricing: enPricing,
      tickets: enTickets,
      profile: enProfile,
      articles: enArticles,
      config: enConfig
    }
  },
  es: {
    translation: {
      ...esShared,
      ...esUI,
      ...esAPI,
      common: esCommon,
      sidebar: esSidebar,
      response: esResponse,
      error: esError,
      pagination: esPagination,
      auth: esAuth,
      team: esTeam,
      settings: esSettings,
      support: esSupport,
      pricing: esPricing,
      tickets: esTickets,
      profile: esProfile,
      articles: esArticles,
      config: esConfig
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    debug: import.meta.env.DEV,
    fallbackLng: fallbackLanguage,
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    resources,
  });

export default i18n;

export const getLanguage = () => {
  return (
    i18n.language ||
    (typeof window !== "undefined" && window.localStorage.i18nextLng) ||
    fallbackLanguage
  );
};
