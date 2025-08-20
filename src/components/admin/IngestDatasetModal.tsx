'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';

interface IngestDatasetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onIngest: (fileContent: string) => Promise<void>;
  isIngesting: boolean;
}

export function IngestDatasetModal({ isOpen, onClose, onIngest, isIngesting }: IngestDatasetModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type === 'application/json') {
        setSelectedFile(file);
        setError(null);
      } else {
        setError('Please select a valid JSON file.');
        setSelectedFile(null);
      }
    }
  };

  const handleIngestClick = async () => {
    if (!selectedFile) {
      setError('Please select a file to ingest.');
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      const text = e.target?.result as string;
      try {
        JSON.parse(text); // Validate JSON format before sending
        await onIngest(text);
        onClose(); // Close modal on success
      } catch {
        setError('Invalid JSON file. Please check the file content and try again.');
      }
    };
    reader.onerror = () => {
      setError('Failed to read the file.');
    };
    reader.readAsText(selectedFile);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[color:var(--color-dark-bg-tertiary)] sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Ingest DPO Dataset</DialogTitle>
          <DialogDescription>
            Upload a JSON file containing an array of DPO entries to populate the database.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="json-file">JSON File</Label>
            <Input id="json-file" type="file" accept=".json,application/json" onChange={handleFileChange} />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isIngesting}>
            Cancel
          </Button>
          <Button onClick={handleIngestClick} disabled={!selectedFile || isIngesting} className="btn-cta-dark">
            {isIngesting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {isIngesting ? 'Ingesting...' : 'Ingest Dataset'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
