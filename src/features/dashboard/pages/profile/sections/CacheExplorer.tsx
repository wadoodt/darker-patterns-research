import { useState, useEffect, useCallback } from "react";
import { useCache } from "../../../../../contexts/CacheContext";
import { Button, Flex, Text, Heading, TextField, Code, Box, Card, Spinner } from "@radix-ui/themes";
import type { CacheEntryInfo } from "../../../../../contexts/CacheContext/types";
import { CacheEditor } from "./CacheEditor";

function CacheDetail({ 
  entry, 
  onClose, 
  isLoading 
}: { 
  entry: CacheEntryInfo, 
  onClose: () => void, 
  isLoading: boolean 
}) {
  const { getEntryData, updateEntry, deleteEntry, getKeyTTL, isEditableKey } = useCache();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<object | null>(null);
  const [editTtl, setEditTtl] = useState<number | null>(null);
  const [isEditorLoading, setIsEditorLoading] = useState(false);

  const handleEdit = async () => {
    setIsEditorLoading(true);
    try {
      const [data, ttl] = await Promise.all([
        getEntryData(entry.key),
        getKeyTTL(entry.key),
      ]);
      if (data) {
        setEditData(data as object);
        setEditTtl(ttl);
        setIsEditing(true);
      } else {
        alert('Failed to load entry data. It might have expired.');
      }
    } catch (error) {
      alert(`Error loading data for editing: ${error}`);
    } finally {
      setIsEditorLoading(false);
    }
  };

  const handleSave = async (data: object, ttl: number) => {
    if (window.confirm('Are you sure you want to save these changes?')) {
      try {
        await updateEntry(entry.key, data, ttl);
        setIsEditing(false);
        onClose(); // Refresh the view
      } catch (error) {
        alert(`Error saving entry: ${error}`);
      }
    }
  };

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete the key "${entry.key}"? This action cannot be undone.`)) {
      try {
        await deleteEntry(entry.key);
        onClose(); // Refresh the view
      } catch (error) {
        alert(`Error deleting entry: ${error}`);
      }
    }
  };

  if (isEditing && editData) {
    return (
      <CacheEditor 
        initialData={editData} 
        initialTtl={editTtl}
        onSave={handleSave}
        onCancel={() => setIsEditing(false)}
      />
    )
  }

  return (
    <Card size="2">
      <Flex direction="column" gap="3">
        <Heading size="3">Cache Entry Details</Heading>
        {isLoading ? (
          <Spinner />
        ) : (
          <>
            <Text size="2"><strong>Key:</strong> <Code>{entry.key}</Code></Text>
            <Text size="2"><strong>Created At:</strong> {new Date(entry.createdAt).toLocaleString()}</Text>
            <Text size="2"><strong>Expires At:</strong> {new Date(entry.expiresAt).toLocaleString()}</Text>
            <Text size="2"><strong>Size:</strong> {entry.size} bytes</Text>
            <Text size="2"><strong>Data Preview:</strong></Text>
            <Box p="2" style={{ background: 'var(--gray-a2)', borderRadius: 'var(--radius-2)' }}>
              <Code wrap="wrap">{entry.dataPreview}</Code>
            </Box>
            <Flex gap="2" mt="3">
              {isEditableKey(entry.key) && (
                <Button onClick={handleEdit} disabled={isEditorLoading}>Edit</Button>
              )}
              <Button color="red" onClick={handleDelete}>Delete</Button>
            </Flex>
          </>
        )}
        <Button onClick={onClose} style={{ marginTop: '1rem' }}>Close</Button>
      </Flex>
    </Card>
  );
}

export function CacheExplorer() {
  const { listKeys, inspectEntry } = useCache();
  const [keys, setKeys] = useState<string[]>([]);
  const [cursor, setCursor] = useState<string | undefined>(undefined);
  const [hasMore, setHasMore] = useState(false);
  const [prefix, setPrefix] = useState("");
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [selectedEntry, setSelectedEntry] = useState<CacheEntryInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchKeys = useCallback(async (newPrefix?: string, newCursor?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const { keys: newKeys, cursor: nextCursor, hasMore: newHasMore } = await listKeys(newPrefix, newCursor);
      setKeys(prev => newCursor ? [...prev, ...newKeys] : newKeys);
      setCursor(nextCursor);
      setHasMore(newHasMore);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch keys");
    }
    setIsLoading(false);
  }, [listKeys]);

  useEffect(() => {
    fetchKeys(prefix);
  }, [prefix, fetchKeys]);

  const handleInspect = async (key: string) => {
    setSelectedKey(key);
    setIsLoadingDetails(true);
    try {
      const entry = await inspectEntry(key);
      setSelectedEntry(entry);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to inspect entry");
    } finally {
      setIsLoadingDetails(false);
    }
  };

  return (
    <Flex direction="column" gap="4">
      <Heading size="4">Cache Explorer</Heading>
      <TextField.Root
        placeholder="Filter by key prefix..."
        value={prefix}
        onChange={(e) => setPrefix(e.target.value)}
      />
      {error && <Text color="red">{error}</Text>}
      <Flex direction="column" gap="2">
        {keys.map(key => (
          <Button key={key} onClick={() => handleInspect(key)} variant="soft">
            {key}
          </Button>
        ))}
      </Flex>
      {isLoading && <Spinner />}
      {hasMore && (
        <Button onClick={() => fetchKeys(prefix, cursor)} disabled={isLoading}>
          Load More
        </Button>
      )}
      {selectedKey && selectedEntry && (
        <CacheDetail 
          entry={selectedEntry} 
          onClose={() => setSelectedKey(null)} 
          isLoading={isLoadingDetails} 
        />
      )}
    </Flex>
  );
}
