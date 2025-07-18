import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from '@features/dashboard/pages/App.tsx';
import "@styles/dashboard.css";

import "@radix-ui/themes/styles.css";
import "@locales/i18n";
import { AuthProvider } from "@contexts/AuthContext";
import ErrorBoundary from "@components/ErrorBoundary";
import { CacheProvider } from "@contexts/CacheContext";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <CacheProvider>
          <ErrorBoundary>
            <App />
          </ErrorBoundary>
        </CacheProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
