// src/components/CacheAdminPanel.tsx
"use client";

import { useState } from "react";
import { useCache } from "@contexts/CacheContext";
import { Button, Flex, Text, Heading } from "@radix-ui/themes";

type CacheAdminPanelButtonsProps = {
  invalidateProfile: () => void;
  invalidateMyTickets: () => void;
  invalidateAllFaqs: () => void;
  clearAllExpired: () => void;
  isLoading: boolean;
  isReady: boolean;
};

const CacheAdminPanelButtons = ({
  invalidateProfile,
  invalidateMyTickets,
  invalidateAllFaqs,
  clearAllExpired,
  isLoading,
  isReady,
}: CacheAdminPanelButtonsProps) => (
  <Flex wrap="wrap" gap="2">
    <Button
      onClick={invalidateProfile}
      disabled={isLoading || !isReady}
      color="violet"
    >
      Invalidate Profile Cache
    </Button>
    <Button
      onClick={invalidateMyTickets}
      disabled={isLoading || !isReady}
      color="orange"
    >
      Invalidate My Tickets Cache
    </Button>
    <Button
      onClick={invalidateAllFaqs}
      disabled={isLoading || !isReady}
      color="red"
    >
      Invalidate All FAQs
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

type CacheAdminPanelViewProps = CacheAdminPanelButtonsProps & {
  statusMessage: string;
};

const CacheAdminPanelView = ({
  statusMessage,
  isReady,
  ...buttonProps
}: CacheAdminPanelViewProps) => (
  <Flex direction="column" align="center">
    <Heading size="4" mb="4">Cache Administration</Heading>
    <CacheAdminPanelButtons {...buttonProps} isReady={isReady} />
    {statusMessage && (
      <Text as="p">
        {statusMessage}
      </Text>
    )}
    {!isReady && (
      <Text as="p">
        Cache system is not ready.
      </Text>
    )}
  </Flex>
);

export function CacheAdminPanel() {
  const { cleanupExpired, isReady } = useCache();
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

  const invalidateProfile = () =>
    handleAction(
      () => cleanupExpired(),
      "User profile cache cleared.",
    );

  const invalidateMyTickets = () =>
    handleAction(
      () => cleanupExpired(),
      "My tickets cache invalidated.",
    );

  const invalidateAllFaqs = () =>
    handleAction(
      () => cleanupExpired(),
      "All FAQs cache invalidated.",
    );

  const clearAllExpired = () =>
    handleAction(
      () => cleanupExpired(),
      "Successfully cleared all expired cache entries.",
    );

  return (
    <CacheAdminPanelView
      invalidateProfile={invalidateProfile}
      invalidateMyTickets={invalidateMyTickets}
      invalidateAllFaqs={invalidateAllFaqs}
      clearAllExpired={clearAllExpired}
      isLoading={isLoading}
      isReady={isReady}
      statusMessage={statusMessage}
    />
  );
}
