import React from 'react';
import ReactDOM from 'react-dom/client';
import LoginPage from './login/LoginPage.tsx';
import PublicLayout from '@layouts/PublicLayout';
import { AuthProvider } from '@contexts/AuthContext';
import '@styles/login.css';

import '@locales/i18n.ts';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
      <AuthProvider>
        <PublicLayout>
            <LoginPage />
          </PublicLayout>
      </AuthProvider>
  </React.StrictMode>
);
