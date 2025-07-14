import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from '../App';
import '../styles/dashboard.css';
import { Theme } from '@radix-ui/themes';
import '@radix-ui/themes/styles.css';
import '../utils/i18n'; // Import i18n configuration
import { AuthProvider } from '../contexts/AuthContext';
import ErrorBoundary from '../components/ErrorBoundary';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Theme appearance="light" accentColor="blue" radius="large">
          <ErrorBoundary>
            <App />
          </ErrorBoundary>
        </Theme>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
