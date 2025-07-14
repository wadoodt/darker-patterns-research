import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import SignupPage from './SignupPage.tsx';
import PublicLayout from '../layouts/PublicLayout';
import { AuthProvider } from '../contexts/AuthContext';
import '../styles/signup.css';
import { Theme } from '@radix-ui/themes';
import '@radix-ui/themes/styles.css';
import '../utils/i18n'; // Import i18n configuration

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Theme appearance="light" accentColor="blue" radius="large">
          <PublicLayout>
            <SignupPage />
          </PublicLayout>
        </Theme>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
