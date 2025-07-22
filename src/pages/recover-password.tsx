import React from "react";
import ReactDOM from "react-dom/client";
import RecoverPasswordPage from "./recover-password/RecoverPasswordPage.tsx";
import PublicLayout from "@layouts/PublicLayout";
import { AuthProvider } from "@contexts/AuthContext";
import "@styles/recover-password.css";
import { AppProvider } from "@contexts/AppContext/AppContext.tsx";
import "@locales/i18n.ts";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AppProvider>
      <AuthProvider>
        <PublicLayout>
          <RecoverPasswordPage />
        </PublicLayout>
      </AuthProvider>
    </AppProvider>
  </React.StrictMode>,
);
