import React from 'react';
import ReactDOM from 'react-dom/client';
import SuccessPage from './success/SuccessPage.tsx';
import PublicLayout from '@layouts/PublicLayout';
import '@styles/landing.css';

import '@locales/i18n.ts';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <PublicLayout>
        <SuccessPage />
      </PublicLayout>
  </React.StrictMode>
);
