'use client';

import { useExportDpoDataset } from '@/hooks/useExportDpoDataset';
import { Button } from '@/components/ui/button';
import { Download, Loader2, AlertTriangle } from 'lucide-react';

const ExportDpoDatasetButton = () => {
  const { isLoading, error, handleExport } = useExportDpoDataset();

  return (
    <div className="border-dark-border bg-dark-background-secondary flex flex-col items-start space-y-4 rounded-lg border p-4">
      <h3 className="text-dark-text-primary text-lg font-semibold">Export DPO Dataset</h3>
      <p className="text-dark-text-secondary text-sm">
        Download the DPO entries, augmented with evaluation statistics. Choose your preferred format.
      </p>
      <div className="flex items-center space-x-2">
        <Button
          onClick={() => handleExport('json', false)}
          disabled={isLoading}
          variant="outline"
          className="w-full sm:w-auto"
        >
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
          Download as JSON
        </Button>
        <Button
          onClick={() => handleExport('csv', false)}
          disabled={isLoading}
          variant="outline"
          className="w-full sm:w-auto"
        >
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
          Download as CSV
        </Button>
      </div>
      {error && (
        <div className="flex items-center text-sm text-red-500">
          <AlertTriangle className="mr-2 h-4 w-4" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export default ExportDpoDatasetButton;
