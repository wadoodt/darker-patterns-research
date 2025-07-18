import type { ThemeProps } from "@radix-ui/themes";

export type AppThemeKey =
  | "light"
  | "dark"
  | "high-contrast-light"
  | "high-contrast-dark"
  | "light-simple";

export const themeConfigs: Record<AppThemeKey, ThemeProps> = {
  light: {
    appearance: "light",
    accentColor: "blue",
    grayColor: "slate",
    panelBackground: "solid",
    radius: "large",
  },
  dark: {
    appearance: "dark",
    accentColor: "blue",
    grayColor: "slate",
    panelBackground: "solid",
    radius: "large",
  },
  "high-contrast-light": {
    appearance: "light",
    accentColor: "blue",
    grayColor: "slate",
    panelBackground: "solid",
    radius: "large",
  },
  "high-contrast-dark": {
    appearance: "dark",
    accentColor: "blue",
    grayColor: "slate",
    panelBackground: "solid",
    radius: "large",
  },
  "light-simple": {
    appearance: "light",
    accentColor: "gray",
    grayColor: "gray",
    panelBackground: "solid",
    radius: "large",
  },
};
