// src/components/CacheAdminPanel.tsx
"use client";

import { useState } from "react";
import { useCache } from "@contexts/CacheContext";
import { Box, Button, Card, Flex, Heading, Text } from "@radix-ui/themes";
import styles from "./CacheAdminPanel.module.css";

const CacheAdminPanelButtons = ({
  invalidateCompanies,
  invalidateProfile,
  clearAllExpired,
  isLoading,
  isReady,
}: {
  invalidateCompanies: () => void;
  invalidateProfile: () => void;
  clearAllExpired: () => void;
  isLoading: boolean;
  isReady: boolean;
}) => (
  <Flex wrap="wrap" gap="2">
    <Button
      onClick={invalidateCompanies}
      disabled={isLoading || !isReady}
      color="blue"
    >
      Invalidate Companies Cache
    </Button>
    <Button
      onClick={invalidateProfile}
      disabled={isLoading || !isReady}
      color="violet"
    >
      Invalidate Profile Cache
    </Button>
    <Button
      onClick={clearAllExpired}
      disabled={isLoading || !isReady}
      color="red"
    >
      Clear All Expired
    </Button>
  </Flex>
);

export function CacheAdminPanel() {
  const { invalidateByPattern, cleanupExpired, isReady } = useCache();
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

  const invalidateCompanies = () =>
    handleAction(
      () => invalidateByPattern("async-data:companies*"),
      "Successfully invalidated companies cache.",
    );

  const invalidateProfile = () =>
    handleAction(
      () => invalidateByPattern("async-data:user-profile*"),
      "Successfully invalidated user profile cache.",
    );

  const clearAllExpired = () =>
    handleAction(
      () => cleanupExpired(),
      "Successfully cleared all expired cache entries.",
    );

  return (
    <Card>
      <Box>
        <Heading as="h3" size="3" mb="3">
          Cache Management
        </Heading>
        <CacheAdminPanelButtons
          invalidateCompanies={invalidateCompanies}
          invalidateProfile={invalidateProfile}
          clearAllExpired={clearAllExpired}
          isLoading={isLoading}
          isReady={isReady}
        />
        {statusMessage && (
          <Text as="p" className={styles.statusMessage}>
            {statusMessage}
          </Text>
        )}
        {!isReady && (
          <Text as="p" className={styles.notReadyMessage}>
            Cache system is not ready.
          </Text>
        )}
      </Box>
    </Card>
  );
}
