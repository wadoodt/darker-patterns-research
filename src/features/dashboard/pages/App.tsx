import { Theme } from "@radix-ui/themes";
import { AppProvider } from "@contexts/AppContext";
import { useApp } from "@hooks/useApp";
import { AppRoutes } from "@features/dashboard/routes";

import type { ThemeProps } from "@radix-ui/themes";
import type { AppSettings } from "@contexts/AppContext/types";

// Helper to get Radix theme props from our custom theme settings
const getThemeProps = (theme: AppSettings["theme"]): ThemeProps => {
  const isDark = theme.includes("dark");
  const appearance = isDark ? "dark" : "light";

  if (theme === "light-simple") {
    return { appearance, scaling: "90%", radius: "small" };
  }

  return { appearance };
};

// The content of the app needs to be in a separate component to access the context
const AppContent = () => {
  const { settings } = useApp();
  const themeProps = getThemeProps(settings.theme);

  return (
    <Theme {...themeProps}>
      <AppRoutes />
    </Theme>
  );
};

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
