import React from "react";
import ReactDOM from "react-dom/client";
import RecoverPasswordPage from "./recover-password/RecoverPasswordPage.tsx";
import PublicLayout from "@layouts/PublicLayout";
import { AuthProvider } from "@contexts/AuthContext";
import "@styles/recover-password.css";

import "@locales/i18n.ts";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <PublicLayout>
        <RecoverPasswordPage />
      </PublicLayout>
    </AuthProvider>
  </React.StrictMode>,
);
