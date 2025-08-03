// src/components/CacheAdminPanel.tsx
"use client";

import { useState } from "react";
import { useCache } from "@contexts/CacheContext";
import { Button, Flex, Text, Heading } from "@radix-ui/themes";
import { cacheKeys } from "@api/cacheKeys";

const CACHE_DOMAINS = Object.keys(cacheKeys);

export function CacheAdminPanel() {
  const { invalidateCacheKeys, cleanupExpired, isReady } = useCache();
  const [statusMessage, setStatusMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleAction = async (
    action: () => Promise<void>,
    successMessage: string,
  ) => {
    if (!isReady) return;
    setIsLoading(true);
    setStatusMessage("");
    try {
      await action();
      setStatusMessage(successMessage);
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
      `Successfully invalidated all '${domain}' cache entries.`,
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
      <Heading size="4">Cache Administration</Heading>
      <Flex wrap="wrap" gap="2">
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
      {!isReady && <Text as="p">Cache system is not ready.</Text>}
    </Flex>
  );
}
