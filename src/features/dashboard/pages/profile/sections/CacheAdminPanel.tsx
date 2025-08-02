// src/components/CacheAdminPanel.tsx
"use client";

import { useState } from "react";
import { useCache } from "@contexts/CacheContext";
import { Box, Button, Card, Flex, Heading, Text } from "@radix-ui/themes";
import styles from "./CacheAdminPanel.module.css";

type CacheAdminPanelButtonsProps = {
  invalidateCompanies: () => void;
  invalidateProfile: () => void;
  invalidateTeam: () => void;
  invalidateNotifications: () => void;
  invalidateMyTickets: () => void;
  invalidateAllFaqs: () => void;
  invalidateHomeFaqs: () => void;
  invalidatePricingFaqs: () => void;
  invalidateKnowledgeBaseArticles: () => void;
  clearAllExpired: () => void;
  isLoading: boolean;
  isReady: boolean;
};

const CacheAdminPanelButtons = ({
  invalidateCompanies,
  invalidateProfile,
  invalidateTeam,
  invalidateNotifications,
  invalidateMyTickets,
  invalidateAllFaqs,
  invalidateHomeFaqs,
  invalidatePricingFaqs,
  invalidateKnowledgeBaseArticles,
  clearAllExpired,
  isLoading,
  isReady,
}: CacheAdminPanelButtonsProps) => (
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
      onClick={invalidateTeam}
      disabled={isLoading || !isReady}
      color="green"
    >
      Invalidate Team Cache
    </Button>
    <Button
      onClick={invalidateNotifications}
      disabled={isLoading || !isReady}
      color="blue"
    >
      Invalidate Notifications Cache
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
      onClick={invalidateHomeFaqs}
      disabled={isLoading || !isReady}
      color="teal"
    >
      Invalidate Home FAQs
    </Button>
    <Button
      onClick={invalidatePricingFaqs}
      disabled={isLoading || !isReady}
      color="cyan"
    >
      Invalidate Pricing FAQs
    </Button>
    <Button
      onClick={invalidateKnowledgeBaseArticles}
      disabled={isLoading || !isReady}
      color="yellow"
    >
      Invalidate Knowledge Base Articles
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
  <Card>
    <Box>
      <Heading as="h3" size="3" mb="3">
        Cache Management
      </Heading>
      <CacheAdminPanelButtons {...buttonProps} isReady={isReady} />
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
      () => invalidateByPattern("user-profile"),
      "User profile cache cleared.",
    );

  const invalidateTeam = () =>
    handleAction(
      () => invalidateByPattern("async-data:team-members:*"),
      "Team members cache cleared.",
    );

  const invalidateNotifications = () =>
    handleAction(
      () => invalidateByPattern("notifications:*"),
      "Notifications cache invalidated.",
    );

  const invalidateMyTickets = () =>
    handleAction(
      () => invalidateByPattern("my-tickets:*"),
      "My tickets cache invalidated.",
    );

  const invalidateAllFaqs = () =>
    handleAction(
      () => invalidateByPattern("async-data:faqs*"),
      "All FAQs cache invalidated.",
    );

  const invalidateHomeFaqs = () =>
    handleAction(
      () => invalidateByPattern("async-data:faqs:home"),
      "Home FAQs cache invalidated.",
    );

  const invalidatePricingFaqs = () =>
    handleAction(
      () => invalidateByPattern("async-data:faqs:pricing"),
      "Pricing FAQs cache invalidated.",
    );

  const invalidateKnowledgeBaseArticles = () =>
    handleAction(
      () => invalidateByPattern("async-data:knowledge-base:articles"),
      "Knowledge base articles cache invalidated.",
    );

  const clearAllExpired = () =>
    handleAction(
      () => cleanupExpired(),
      "Successfully cleared all expired cache entries.",
    );

  return (
    <CacheAdminPanelView
      invalidateCompanies={invalidateCompanies}
      invalidateProfile={invalidateProfile}
      invalidateTeam={invalidateTeam}
      invalidateNotifications={invalidateNotifications}
      invalidateMyTickets={invalidateMyTickets}
      invalidateAllFaqs={invalidateAllFaqs}
      invalidateHomeFaqs={invalidateHomeFaqs}
      invalidatePricingFaqs={invalidatePricingFaqs}
      invalidateKnowledgeBaseArticles={invalidateKnowledgeBaseArticles}
      clearAllExpired={clearAllExpired}
      isLoading={isLoading}
      isReady={isReady}
      statusMessage={statusMessage}
    />
  );
}
