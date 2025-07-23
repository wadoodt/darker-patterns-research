import { Box, Flex, Heading, Text } from "@radix-ui/themes";
import { useTranslation } from "react-i18next";

import { Profile } from "@features/dashboard/pages/profile/sections/Profile";
import { CacheAdminPanel } from "@features/dashboard/pages/profile/sections/CacheAdminPanel";
import LanguageSelector from "@features/dashboard/pages/profile/sections/LanguageSelector";
import ThemeSwitcher from "@features/dashboard/pages/profile/sections/ThemeSwitcher";
import SettingSection from "@components/SettingSection";
import styles from "./GeneralTab.module.css";

export function GeneralTab() {
  const { t } = useTranslation();

  return (
    <Box className={styles.container}>
      <Box>
        <Heading as="h2" size="7" weight="bold">
          {t("profile.general.title")}
        </Heading>
        <Text color="gray">{t("profile.general.description")}</Text>
      </Box>

      <SettingSection title={t("profile.general.userInformation")}>
        <Profile />
      </SettingSection>

      <SettingSection title={t("profile.general.appExperience")}>
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

      <SettingSection title={t("profile.general.cacheManagement")}>
        <CacheAdminPanel />
      </SettingSection>
    </Box>
  );
}
