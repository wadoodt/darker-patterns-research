import React from "react";
import { Select } from "@radix-ui/themes";
import { useApp } from "@hooks/useApp";
import { useTranslation } from "react-i18next";
import type { AppSettings } from "@contexts/AppContext/types";

const ThemeSwitcher: React.FC = () => {
  const { settings, updateSettings } = useApp();
  const { t } = useTranslation();

  const handleThemeChange = (value: AppSettings["theme"]) => {
    updateSettings({ theme: value });
  };

  const availableThemes = [
    { value: "light", label: t("settings.theme.options.light") },
    { value: "dark", label: t("settings.theme.options.dark") },
    {
      value: "high-contrast-light",
      label: t("settings.theme.options.highContrastLight"),
    },
    {
      value: "high-contrast-dark",
      label: t("settings.theme.options.highContrastDark"),
    },
    { value: "light-simple", label: t("settings.theme.options.lightSimple") },
  ];

  return (
    <Select.Root value={settings.theme} onValueChange={handleThemeChange}>
      <Select.Trigger aria-label={t("settings.theme.description")} />
      <Select.Content>
        {availableThemes.map((theme) => (
          <Select.Item key={theme.value} value={theme.value}>
            {theme.label}
          </Select.Item>
        ))}
      </Select.Content>
    </Select.Root>
  );
};

export default ThemeSwitcher;
