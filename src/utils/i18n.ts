import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    debug: import.meta.env.DEV,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    resources: {
      en: {
        translation: {
          "public_header": "Public Header",
          "public_footer": "Public Footer",
          "dashboard_header": "Dashboard Header Placeholder",
          "sidebar_placeholder": "Sidebar Placeholder",
          "public_landing_page": "Public Landing Page",
          "protected_dashboard_home": "Protected Dashboard Home",
          "response": {
            "auth": {
              "login_success": "Login successful! Redirecting..."
            },
            "general": {
              "operation_success": "Operation completed successfully."
            }
          },
          "error": {
            "general": {
              "internal_server_error": "An internal server error occurred. Please try again later.",
              "not_found": "The requested resource was not found."
            },
            "auth": {
              "invalid_credentials": "Invalid username or password. Please try again.",
              "unauthorized": "You are not authorized to perform this action."
            },
            "validation": {
              "validation_error": "There were errors with your submission. Please check the fields and try again."
            }
          }
        }
      },
      es: {
        translation: {
          "public_header": "Encabezado Público",
          "public_footer": "Pie de Página Público",
          "dashboard_header": "Marcador de Posición del Encabezado del Panel",
          "sidebar_placeholder": "Marcador de Posición de la Barra Lateral",
          "public_landing_page": "Página de Aterrizaje Pública",
          "protected_dashboard_home": "Inicio del Panel Protegido"
        }
      }
    }
  });

export default i18n;

