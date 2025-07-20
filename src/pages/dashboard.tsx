import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "@styles/dashboard.css";
import "@styles/theme-overrides.css";

import "@radix-ui/themes/styles.css";
import "@locales/i18n";
import { AuthProvider } from "@contexts/AuthContext";
import ErrorBoundary from "@layouts/dashboard/ErrorBoundary";
import { CacheProvider } from "@contexts/CacheContext";
import { AppProvider } from "@contexts/AppContext";
import DashboardPage from "./dashboard/DashboardPage";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AppProvider>
        <AuthProvider>
          <CacheProvider>
            <ErrorBoundary>
              <DashboardPage />
            </ErrorBoundary>
          </CacheProvider>
        </AuthProvider>
      </AppProvider>
    </BrowserRouter>
  </React.StrictMode>
);
