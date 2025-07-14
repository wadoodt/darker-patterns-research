// src/components/CacheAdminPanel.tsx
'use client';

import { useState } from 'react';
import { useCache } from '@contexts/CacheContext';

export function CacheAdminPanel() {
  const { invalidateByPattern, cleanupExpired, isReady } = useCache();
  const [statusMessage, setStatusMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAction = async (action: () => Promise<void>, successMessage: string) => {
    if (!isReady) return;
    setIsLoading(true);
    setStatusMessage('');
    try {
      await action();
      setStatusMessage(successMessage);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
      setStatusMessage(`Error: ${errorMessage}`);
    } finally {
      setIsLoading(false);
      setTimeout(() => setStatusMessage(''), 3000); // Clear message after 3 seconds
    }
  };

  const invalidateCompanies = () =>
    handleAction(() => invalidateByPattern('async-data:companies*'), 'Successfully invalidated companies cache.');

  const invalidateProfile = () =>
    handleAction(
      () => invalidateByPattern('async-data:user-profile*'),
      'Successfully invalidated user profile cache.',
    );

  const clearAllExpired = () => handleAction(() => cleanupExpired(), 'Successfully cleared all expired cache entries.');

  return (
    <div style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '16px', backgroundColor: '#f9f9f9' }}>
      <h3 style={{ marginBottom: '12px', fontSize: '1.125rem', fontWeight: '600' }}>Cache Management</h3>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
        <button
          onClick={invalidateCompanies}
          disabled={isLoading || !isReady}
          style={{ padding: '8px 12px', borderRadius: '4px', color: 'white', backgroundColor: '#3b82f6', border: 'none', cursor: 'pointer' }}
        >
          Invalidate Companies Cache
        </button>
        <button
          onClick={invalidateProfile}
          disabled={isLoading || !isReady}
          style={{ padding: '8px 12px', borderRadius: '4px', color: 'white', backgroundColor: '#8b5cf6', border: 'none', cursor: 'pointer' }}
        >
          Invalidate Profile Cache
        </button>
        <button
          onClick={clearAllExpired}
          disabled={isLoading || !isReady}
          style={{ padding: '8px 12px', borderRadius: '4px', color: 'white', backgroundColor: '#ef4444', border: 'none', cursor: 'pointer' }}
        >
          Clear All Expired
        </button>
      </div>
      {statusMessage && <p style={{ marginTop: '12px', fontSize: '0.875rem' }}>{statusMessage}</p>}
      {!isReady && <p style={{ marginTop: '12px', fontSize: '0.875rem', color: '#c2410c' }}>Cache system is not ready.</p>}
    </div>
  );
}
