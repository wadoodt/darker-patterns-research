import React from "react";
import ReactDOM from "react-dom/client";
import LoginPage from "./login/LoginPage.tsx";
import PublicLayout from "@layouts/PublicLayout";
import { AuthProvider } from "@contexts/AuthContext";
import "@styles/login.css";
import { AppProvider } from "@contexts/AppContext/AppContext.tsx";
import "@locales/i18n.ts";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AppProvider>
      <AuthProvider>
        <PublicLayout>
          <LoginPage />
        </PublicLayout>
      </AuthProvider>
    </AppProvider>
  </React.StrictMode>
);
