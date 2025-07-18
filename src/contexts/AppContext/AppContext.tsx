import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { defaultSettings } from "./types";
import { AppContext } from "./context";

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { i18n } = useTranslation();
  const [settings, setSettings] = useState(() => {
    // Load settings from localStorage if available
    const savedSettings = localStorage.getItem("appSettings");
    return savedSettings ? JSON.parse(savedSettings) : defaultSettings;
  });

  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("appSettings", JSON.stringify(settings));
  }, [settings]);

  // Update language in i18n when it changes
  useEffect(() => {
    i18n.changeLanguage(settings.language);
  }, [settings.language, i18n]);

  const updateSettings = (newSettings: Partial<typeof defaultSettings>) => {
    setSettings((prev: typeof defaultSettings) => ({
      ...prev,
      ...newSettings,
      notifications: {
        ...prev.notifications,
        ...(newSettings.notifications || {}),
      },
    }));
  };

  const availableLanguages = [
    { code: "en", name: "English" },
    { code: "es", name: "Español" },
  ];

  const isHighContrast = settings.theme.includes("high-contrast");

  return (
    <AppContext.Provider
      value={{ settings, updateSettings, availableLanguages, isHighContrast }}
    >
      {children}
    </AppContext.Provider>
  );
};
