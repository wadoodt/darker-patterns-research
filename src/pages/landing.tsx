import React from 'react';
import ReactDOM from 'react-dom/client';
import LandingPage from './landing/LandingPage.tsx';
import PublicLayout from '@layouts/PublicLayout';
import '@styles/landing.css';

import '@locales/i18n.ts';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <PublicLayout>
        <LandingPage />
      </PublicLayout>
  </React.StrictMode>
);
