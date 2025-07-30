import React from "react";
import ReactDOM from "react-dom/client";
import PricingPage from "./pricing/PricingPage.tsx";
import PublicLayout from "@layouts/PublicLayout";
import "@styles/landing.css";
import { AppProvider } from "@contexts/AppContext/AppContext.tsx";
import "@locales/i18n.ts";
import { AuthProvider } from "@contexts/AuthContext/AuthContext.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <AppProvider>
        <PublicLayout>
          <PricingPage />
        </PublicLayout>
      </AppProvider>
    </AuthProvider>
  </React.StrictMode>
);
