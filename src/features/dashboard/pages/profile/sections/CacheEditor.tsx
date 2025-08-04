import { useRef } from 'react';
import JsonEditor, { type JsonEditorRef } from 'react-json-editor-ui';
import { Button, TextField, Text, Heading, Flex, Callout, Box } from '@radix-ui/themes';
import { ExclamationTriangleIcon, CheckCircledIcon } from '@radix-ui/react-icons';
import { useCacheEditor } from '@hooks/useCacheEditor';
import { formatTtl } from '@utils/cacheUtils';

interface CacheEditorProps {
  initialData: object;
  initialTtl: number | null;
  onSave: (data: object, ttl: number) => void;
  onCancel: () => void;
}

export function CacheEditor({ initialData, initialTtl, onSave, onCancel }: CacheEditorProps) {
  const editorRef = useRef<JsonEditorRef>(null);
  const {
    editedData,
    ttl,
    error,
    isSaving,
    success,
    handleSave,
    handleTtlChange,
    setEditedData,
    setError,
  } = useCacheEditor({ initialData, initialTtl, onSave, onCancel });

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
