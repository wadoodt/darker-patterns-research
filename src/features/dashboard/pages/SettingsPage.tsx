import React from "react";
import { Box, Button, Flex, Heading, Switch, Text, TextArea, TextField } from "@radix-ui/themes";
import { useTranslation } from "react-i18next";
import { useAuth } from "@hooks/useAuth";
import { useApp } from "@hooks/useApp";
import SettingSection from "@components/SettingSection";

type CompanySettings = {
  name: string;
  email: string;
  contactInfo: string;
  notificationsEnabled: boolean;
};

const SettingsPage: React.FC = () => {
  const { hasRole } = useAuth();
  const { isHighContrast } = useApp();
  const { t } = useTranslation();
  
  // Mock data - replace with actual data fetching
  const company: CompanySettings = {
    name: "Acme Inc.",
    email: "contact@acme.com",
    contactInfo: "123 Main St, City",
    notificationsEnabled: true,
  };

  return (
    <Box p="4">
      <Heading>{t("settings.title")}</Heading>
      <Flex direction="column" gap="4">
        {hasRole(["admin", "qa"]) && (
          <SettingSection title={t("settings.company.title")}>
            <Flex direction="column" gap="4">
              <Flex direction="column" gap="2">
                <Text>{t("settings.company.name")}</Text>
                <TextField.Root defaultValue={company.name} />
              </Flex>
              <Flex direction="column" gap="2">
                <Text>{t("settings.company.email")}</Text>
                <TextField.Root defaultValue={company.email} type="email" />
              </Flex>
              <Flex direction="column" gap="2">
                <Text>{t("settings.company.contactInfo")}</Text>
                <TextArea defaultValue={company.contactInfo} />
              </Flex>
              <Flex align="center" gap="2">
                <Switch defaultChecked={company.notificationsEnabled} />
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
