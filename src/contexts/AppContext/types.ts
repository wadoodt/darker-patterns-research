export interface AppSettings {
  language: string;
  theme:
    | "light"
    | "dark"
    | "high-contrast-light"
    | "high-contrast-dark"
    | "light-simple";
  notifications: {
    email: boolean;
    push: boolean;
  };
  developerMode: boolean;
  qaMode: boolean;
}

export interface AppContextType {
  settings: AppSettings;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
  availableLanguages: { code: string; name: string }[];
  isHighContrast: boolean;
}

export const defaultSettings: AppSettings = {
  language: "en",
  theme: "light",
  notifications: {
    email: true,
    push: true,
  },
  developerMode: false,
  qaMode: false,
};
