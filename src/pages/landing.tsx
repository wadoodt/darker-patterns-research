import React from 'react';
import ReactDOM from 'react-dom/client';
import LandingPage from './landing/LandingPage.tsx';
import PublicLayout from '@layouts/PublicLayout';
import '@styles/landing.css';
import { Theme } from '@radix-ui/themes';
import '@radix-ui/themes/styles.css';
import '@locales/i18n.ts';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Theme appearance="light" accentColor="blue" radius="large">
      <PublicLayout>
        <LandingPage />
      </PublicLayout>
    </Theme>
  </React.StrictMode>
);
