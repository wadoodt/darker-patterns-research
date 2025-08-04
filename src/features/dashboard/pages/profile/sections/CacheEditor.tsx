import { useState, useEffect, useRef } from 'react';
import JsonEditor, { type JsonEditorRef } from 'react-json-editor-ui';
import { Button, TextField, Text, Heading, Flex, Callout, Box } from '@radix-ui/themes';
import { ExclamationTriangleIcon, CheckCircledIcon } from '@radix-ui/react-icons';

interface CacheEditorProps {
  initialData: object;
  initialTtl: number | null;
  onSave: (data: object, ttl: number) => void;
  onCancel: () => void;
}

export function CacheEditor({ initialData, initialTtl, onSave, onCancel }: CacheEditorProps) {
  const editorRef = useRef<JsonEditorRef>(null);
  const [editedData, setEditedData] = useState(initialData);
  const [ttl, setTtl] = useState(initialTtl ?? 3600);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState(false);

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

  const validateInputs = (): boolean => {
    if (isNaN(ttl) || ttl < 0) {
      setError('TTL must be a positive number');
      return false;
    }
    
    if (ttl > 60 * 60 * 24 * 30) { // 30 days max
      setError('TTL cannot be more than 30 days');
      return false;
    }

    if (!editedData || (typeof editedData === 'object' && Object.keys(editedData).length === 0)) {
      setError('Data cannot be empty');
      return false;
    }

    return true;
  };

  const handleSave = async () => {
    if (!validateInputs()) return;
    
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

  return (
    <Flex direction="column" gap="4">
      <Heading size="4">Edit Cache Entry</Heading>
      
      {error && (
        <Callout.Root color="red">
          <Callout.Icon>
            <ExclamationTriangleIcon />
          </Callout.Icon>
          <Callout.Text>{error}</Callout.Text>
        </Callout.Root>
      )}
      
      {success && (
        <Callout.Root color="green">
          <Callout.Icon>
            <CheckCircledIcon />
          </Callout.Icon>
          <Callout.Text>Changes saved successfully!</Callout.Text>
        </Callout.Root>
      )}
      
      <Box style={{ minHeight: '300px' }}>
        <JsonEditor
          ref={editorRef}
          data={editedData}
          onChange={(data) => {
            try {
              setEditedData(data);
              setError(null);
            } catch (e) {
              console.error('Error updating JSON data:', e);
              setError('Invalid JSON data. Please check the format.');
            }
          }}
        />
      </Box>
      
      <Flex direction="column" gap="2">
        <Text as="label" htmlFor="ttl" size="2" weight="bold">
          TTL (seconds)
          <Text color="gray" size="1" as="span" style={{ marginLeft: '8px' }}>
            {ttl > 0 ? `(expires in ${formatTtl(ttl)})` : 'No expiration'}
          </Text>
        </Text>
        <TextField.Root
          id="ttl"
          type="number"
          min="0"
          value={ttl}
          onChange={handleTtlChange}
          placeholder="Enter TTL in seconds"
        />
      </Flex>
      
      <Flex justify="end" gap="2">
        <Button 
          variant="soft" 
          onClick={onCancel}
          disabled={isSaving}
        >
          Cancel
        </Button>
        <Button 
          onClick={handleSave}
          disabled={isSaving}
        >
          {isSaving ? 'Saving...' : 'Save Changes'}
        </Button>
      </Flex>
    </Flex>
  );
}

// Helper function to format TTL into human-readable format
function formatTtl(seconds: number): string {
  if (seconds < 60) return `${seconds} seconds`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours`;
  return `${Math.floor(seconds / 86400)} days`;
}
