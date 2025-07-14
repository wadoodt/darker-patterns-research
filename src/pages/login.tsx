import React from 'react';
import ReactDOM from 'react-dom/client';
import LoginPage from './login/LoginPage.tsx';
import PublicLayout from '@layouts/PublicLayout';
import { AuthProvider } from '@contexts/AuthContext';
import '@styles/login.css';
import { Theme } from '@radix-ui/themes';
import '@radix-ui/themes/styles.css';
import '@locales/i18n.ts';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
      <AuthProvider>
        <Theme appearance="light" accentColor="blue" radius="large">
          <PublicLayout>
            <LoginPage />
          </PublicLayout>
        </Theme>
      </AuthProvider>
  </React.StrictMode>
);
