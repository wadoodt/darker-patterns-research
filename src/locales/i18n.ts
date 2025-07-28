import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { processCombinedTranslations } from './translationUtils';

// All translations have been migrated to the combined format

// Import combined translation files
import articlesCombined from './articles.combined.json';
import commonCombined from './common.combined.json';
import authCombined from './auth.combined.json';
import pricingCombined from './pricing.combined.json';
import teamCombined from './team.combined.json';
import settingsCombined from './settings.combined.json';
import supportCombined from './support.combined.json';
import ticketsCombined from './tickets.combined.json';
import sidebarCombined from './sidebar.combined.json';
import paginationCombined from './pagination.combined.json';
import responseCombined from './response.combined.json';
import errorCombined from './error.combined.json';
import configCombined from './config.combined.json';
import profileCombined from './profile.combined.json';
import sharedCombined from './shared.combined.json';
import uiCombined from './ui.combined.json';

// Process combined files
const articlesResources = processCombinedTranslations(articlesCombined, 'articles');
const commonResources = processCombinedTranslations(commonCombined, 'common');
const authResources = processCombinedTranslations(authCombined, 'auth');
const pricingResources = processCombinedTranslations(pricingCombined, 'pricing');
const teamResources = processCombinedTranslations(teamCombined, 'team');
const settingsResources = processCombinedTranslations(settingsCombined, 'settings');
const supportResources = processCombinedTranslations(supportCombined, 'support');
const ticketsResources = processCombinedTranslations(ticketsCombined, 'tickets');
const sidebarResources = processCombinedTranslations(sidebarCombined, 'sidebar');
const paginationResources = processCombinedTranslations(paginationCombined, 'pagination');
const responseResources = processCombinedTranslations(responseCombined, 'response');
const errorResources = processCombinedTranslations(errorCombined, 'error');
const configResources = processCombinedTranslations(configCombined, 'config');
const profileResources = processCombinedTranslations(profileCombined, 'profile');
const sharedResources = processCombinedTranslations(sharedCombined, 'shared');
const uiResources = processCombinedTranslations(uiCombined, 'ui');

export const fallbackLanguage = "en";

// Combine translations
const resources = {
  en: {
    translation: {
      articles: articlesResources.en.articles,
      common: commonResources.en.common,
      auth: authResources.en.auth,
      pricing: pricingResources.en.pricing,
      team: teamResources.en.team,
      shared: sharedResources.en.shared,
      ui: uiResources.en.ui,
      response: responseResources.en.response,
      error: errorResources.en.error,
      pagination: paginationResources.en.pagination,
      settings: settingsResources.en.settings,
      support: supportResources.en.support,
      tickets: ticketsResources.en.tickets,
      sidebar: sidebarResources.en.sidebar,
      profile: profileResources.en.profile,
      config: configResources.en.config,
    }
  },
  es: {
    translation: {
      articles: articlesResources.es.articles,
      common: commonResources.es.common,
      auth: authResources.es.auth,
      pricing: pricingResources.es.pricing,
      team: teamResources.es.team,
      shared: sharedResources.es.shared,
      ui: uiResources.es.ui,
      response: responseResources.es.response,
      error: errorResources.es.error,
      pagination: paginationResources.es.pagination,
      settings: settingsResources.es.settings,
      support: supportResources.es.support,
      tickets: ticketsResources.es.tickets,
      sidebar: sidebarResources.es.sidebar,
      profile: profileResources.es.profile,
      config: configResources.es.config,
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
