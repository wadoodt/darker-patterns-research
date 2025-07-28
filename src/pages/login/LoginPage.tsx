import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import LoginTemplate from "./LoginTemplate";
import { useAuth } from "@hooks/useAuth";

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { login, user } = useAuth();
  const { t } = useTranslation();

  useEffect(() => {
    if (user) {
      window.location.href = "/dashboard";
    }
  }, [user]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    try {
      await login(username, password);
      window.location.href = "/dashboard";
    } catch (err) {
      if (err instanceof Error) {
        // The error message is an i18n key like 'error.auth.invalid_credentials'
        // which can be translated by an i18n library.
        setError(t(err.message));
      } else {
        setError(t("error.general.internal_server_error"));
      }
    }
  };

  return (
    <LoginTemplate
      onSubmit={handleSubmit}
      onUsernameChange={setUsername}
      onPasswordChange={setPassword}
      error={error}
    />
  );
};

export default LoginPage;
