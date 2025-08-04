import { useState, useEffect, useRef } from 'react';
import type { JsonEditorRef } from 'react-json-editor-ui';
import { validateCacheInputs } from '../utils/cacheUtils';

interface UseCacheEditorProps {
  initialData: object;
  initialTtl: number | null;
  onSave: (data: object, ttl: number) => void;
  onCancel: () => void;
}

export const useCacheEditor = ({
  initialData,
  initialTtl,
  onSave,
  onCancel,
}: UseCacheEditorProps) => {
  const editorRef = useRef<JsonEditorRef>(null);
  const [editedData, setEditedData] = useState(initialData);
  const [ttl, setTtl] = useState(initialTtl ?? 3600);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleCancel = () => {
    setError(null);
    setSuccess(false);
    onCancel();
  };

  useEffect(() => {
    setEditedData(initialData);
    if (editorRef.current) {
      try {
        editorRef.current.updateData(initialData);
        setError(null);
      } catch (e) {
        setError('Failed to load data for editing. The data might be corrupted.');
        console.error('Error loading data into editor:', e);
      }
    }
  }, [initialData]);

  const handleSave = async () => {
    const validationError = validateCacheInputs(ttl, editedData);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    setIsSaving(true);

    try {
      await onSave(editedData, ttl);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000); // Hide success message after 3 seconds
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'Failed to save changes';
      setError(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  const handleTtlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value >= 0) {
      setTtl(value);
    } else if (e.target.value === '') {
      setTtl(0);
    }
  };

  return {
    editorRef,
    editedData,
    ttl,
    error,
    isSaving,
    success,
    handleSave,
    handleTtlChange,
    handleCancel,
    setEditedData,
    setError,
  };
};