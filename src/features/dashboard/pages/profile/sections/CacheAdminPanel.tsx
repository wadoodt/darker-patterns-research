// src/components/CacheAdminPanel.tsx
"use client";

import { useState } from "react";
import { useCache } from "../../../../../contexts/CacheContext";
import { Button, Flex, Text, Heading } from "@radix-ui/themes";
import { cacheKeys } from "../../../../../api/cacheKeys";
import { CacheExplorer } from "./CacheExplorer";

const CACHE_DOMAINS = Object.keys(cacheKeys);

function InvalidationPanel() {
  const { invalidateCacheKeys, cleanupExpired, isReady } = useCache();
  const [statusMessage, setStatusMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleAction = async <T,>(
    action: () => Promise<T>,
    successMessage: string | ((result: T) => string),
  ) => {
    if (!isReady) return;
    setIsLoading(true);
    setStatusMessage("");
    try {
      const result = await action();
      setStatusMessage(typeof successMessage === 'function' ? successMessage(result) : successMessage);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred.";
      setStatusMessage(`Error: ${errorMessage}`);
    } finally {
      setIsLoading(false);
      setTimeout(() => setStatusMessage(""), 3000);
    }
  };

  const handleInvalidateDomain = (domain: string) => {
    handleAction(
      () => invalidateCacheKeys([domain]),
      (count) => `Successfully invalidated ${count} '${domain}' cache entries.`,
    );
  };

  const handleClearExpired = () => {
    handleAction(
      cleanupExpired,
      "Successfully cleared all expired cache entries.",
    );
  };

  return (
    <Flex direction="column" align="center" gap="4">
      <Heading size="3">Cache Invalidation</Heading>
      <Flex wrap="wrap" gap="2" justify="center">
        {CACHE_DOMAINS.map((domain) => (
          <Button
            key={domain}
            onClick={() => handleInvalidateDomain(domain)}
            disabled={isLoading || !isReady}
          >
            Invalidate {domain}
          </Button>
        ))}
        <Button
          onClick={handleClearExpired}
          disabled={isLoading || !isReady}
          color="red"
        >
          Clear All Expired
        </Button>
      </Flex>
      {statusMessage && <Text as="p">{statusMessage}</Text>}
    </Flex>
  );
}

export function CacheAdminPanel() {
  const [view, setView] = useState<'invalidation' | 'explorer'>('invalidation');
  const { isReady } = useCache();

  return (
    <Flex direction="column" gap="4">
      <Heading size="4" align="center">Cache Administration</Heading>
      
      <Flex gap="3" justify="center">
        <Button onClick={() => setView('invalidation')} variant={view === 'invalidation' ? 'solid' : 'soft'}>
          Invalidation
        </Button>
        <Button onClick={() => setView('explorer')} variant={view === 'explorer' ? 'solid' : 'soft'}>
          Explorer
        </Button>
      </Flex>

      {!isReady && <Text as="p" align="center" color="orange">Cache system is not ready.</Text>}

      {isReady && view === 'invalidation' && <InvalidationPanel />}
      {isReady && view === 'explorer' && <CacheExplorer />}
    </Flex>
  );
}
