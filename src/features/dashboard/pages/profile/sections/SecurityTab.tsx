import { Box, Heading, Text } from "@radix-ui/themes";
import { useTranslation } from "react-i18next";
import { ChangePasswordSection } from "./ChangePasswordSection";
import { TwoFactorAuthSection } from "./TwoFactorAuthSection";
import styles from "./SecurityTab.module.css";

export function SecurityTab() {
  const { t } = useTranslation();

  return (
    <Box className={styles.container}>
      <Box>
        <Heading as="h2" size="7" weight="bold">
          {t("profile.security.title")}
        </Heading>
        <Text color="gray">{t("profile.security.description")}</Text>
      </Box>

      <ChangePasswordSection />
      <TwoFactorAuthSection />
    </Box>
  );
}
