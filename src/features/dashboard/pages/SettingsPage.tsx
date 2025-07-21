import React from "react";
import { Box, Button, Flex, Heading, Text } from "@radix-ui/themes";
import { useAuth } from "@hooks/useAuth";
import { useApp } from "@hooks/useApp";
import { useTranslation } from "react-i18next";
import SettingSection from "@components/SettingSection";

const SettingsPage: React.FC = () => {
  const { hasRole } = useAuth();
  const { t } = useTranslation();
  const { isHighContrast } = useApp();

  return (
    <Box p="4">
      <Heading as="h2" size="6" mb="4">
        {t("settings.title")}
      </Heading>
      <Flex direction="column" gap="4">

        {hasRole(["super-admin"]) && (
          <SettingSection title={t("settings.system.title")}>
            <Flex direction="column" gap="2">
              <Text>{t("settings.system.warning")}</Text>
              <Button color="red" variant="soft" highContrast={isHighContrast}>
                {t("settings.system.shutdown")}
              </Button>
            </Flex>
          </SettingSection>
        )}
      </Flex>
    </Box>
  );
};

export default SettingsPage;
