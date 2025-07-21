import React from "react";
import { Box, Button, Flex, Heading, Text, TextField, TextArea, Switch } from "@radix-ui/themes";
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

        {hasRole(["admin", "qa"]) && (
          <SettingSection title={t("settings.company.title")}>
            <Flex direction="column" gap="4">
              <Flex direction="column" gap="2">
                <Text>{t("settings.company.name")}</Text>
                <TextField.Root />
              </Flex>
              <Flex direction="column" gap="2">
                <Text>{t("settings.company.email")}</Text>
                <TextField.Root type="email" />
              </Flex>
              <Flex direction="column" gap="2">
                <Text>{t("settings.company.contactInfo")}</Text>
                <TextArea />
              </Flex>
              <Flex direction="row" align="center" gap="2">
                <Switch defaultChecked />
                <Text>{t("settings.company.notifications")}</Text>
              </Flex>
              <Button highContrast={isHighContrast}>
                {t("settings.company.save")}
              </Button>
              <Text size="2">
                <a href="/support">{t("settings.company.support")}</a>
              </Text>
            </Flex>
          </SettingSection>
        )}
      </Flex>
    </Box>
  );
};

export default SettingsPage;
