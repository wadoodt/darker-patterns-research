import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import enTranslation from "./en/translation.json";
import esTranslation from "./es/translation.json";

export const fallbackLanguage = "en";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    debug: import.meta.env.DEV,
    fallbackLng: fallbackLanguage,
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    resources: {
      en: {
        translation: enTranslation,
      },
      es: {
        translation: esTranslation,
      },
    },
  });

export default i18n;

export const getLanguage = () => {
  return (
    i18n.language ||
    (typeof window !== "undefined" && window.localStorage.i18nextLng) ||
    fallbackLanguage
  );
};
