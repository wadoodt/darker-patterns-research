import React from 'react';
import ReactDOM from 'react-dom/client';
import PricingPage from './pricing/PricingPage.tsx';
import PublicLayout from '@layouts/PublicLayout';
import '@styles/landing.css';

import '@locales/i18n.ts';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <PublicLayout>
        <PricingPage />
      </PublicLayout>
  </React.StrictMode>
);
