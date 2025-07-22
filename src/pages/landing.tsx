import React from "react";
import ReactDOM from "react-dom/client";
import LandingPage from "./landing/LandingPage.tsx";
import PublicLayout from "@layouts/PublicLayout";
import "@styles/landing.css";

import "@locales/i18n.ts";
import { AppProvider } from "@contexts/AppContext/AppContext.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AppProvider>
      <PublicLayout>
        <LandingPage />
      </PublicLayout>
    </AppProvider>
  </React.StrictMode>,
);
