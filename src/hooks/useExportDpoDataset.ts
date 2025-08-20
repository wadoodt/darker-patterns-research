import { useState } from 'react';
import { httpsCallable } from 'firebase/functions';
import { functions } from '@/lib/firebase';

export const useExportDpoDataset = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleExport = async (format: 'json' | 'csv', includeArchived: boolean) => {
    if (!functions) {
      setError('Firebase Functions not available. Export is disabled.');
      return;
    }

    const exportDpoDataset = httpsCallable(functions, 'exportDpoDataset');

    setIsLoading(true);
    setError(null);

    try {
      const result = await exportDpoDataset({ format, includeArchived });
      const { downloadUrl, success } = result.data as { downloadUrl?: string; success?: boolean };

      if (success && downloadUrl) {
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = `dpo_dataset_${new Date().toISOString()}.${format}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        throw new Error('Failed to retrieve download URL from function.');
      }
    } catch (err: unknown) {
      let message = 'An unknown error occurred.';
      if (err instanceof Error) {
        if ('code' in err) {
          message = `Function error: ${err.message}`;
        } else {
          message = err.message;
        }
      }
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, error, handleExport };
};
