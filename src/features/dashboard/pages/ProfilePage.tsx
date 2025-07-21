// src/features/profile/pages/ProfilePage.tsx
import { Profile } from "@components/Profile";
import { CacheAdminPanel } from "@components/CacheAdminPanel";

import { Box, Flex, Heading, Text } from "@radix-ui/themes";
import LanguageSelector from "@components/LanguageSelector";
import SettingSection from "@components/SettingSection";
import ThemeSwitcher from "@components/ThemeSwitcher";
import { useTranslation } from "react-i18next";

export default function ProfilePage() {
  const { t } = useTranslation();

  return (
    <Box p="4">
      <Heading as="h1" size="6" mb="4">
        Profile & Settings
      </Heading>
      <Flex direction="column" gap="4">
        <SettingSection title="User Information">
          <Profile />
        </SettingSection>

        <SettingSection title="App Experience">
          <Flex direction="column" gap="4">
            <Box>
              <Heading as="h3" size="4" mb="2">
                {t("settings.language.title")}
              </Heading>
              <Text as="p" size="2" color="gray" mb="2">
                {t("settings.language.description")}
              </Text>
              <LanguageSelector />
            </Box>
            <Box>
              <Heading as="h3" size="4" mb="2">
                {t("settings.theme.title")}
              </Heading>
              <Text as="p" size="2" color="gray" mb="2">
                {t("settings.theme.description")}
              </Text>
              <ThemeSwitcher />
            </Box>
          </Flex>
        </SettingSection>

        <SettingSection title="Cache Management">
          <CacheAdminPanel />
        </SettingSection>
      </Flex>
    </Box>
  );
}
