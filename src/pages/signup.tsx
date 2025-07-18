import React from "react";
import ReactDOM from "react-dom/client";
import SignupIndex from "./signup/index";
import PublicLayout from "@layouts/PublicLayout";
import { AuthProvider } from "@contexts/AuthContext";
import "@styles/signup.css";
import "@locales/i18n.ts";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <PublicLayout>
        <SignupIndex />
      </PublicLayout>
    </AuthProvider>
  </React.StrictMode>,
);
