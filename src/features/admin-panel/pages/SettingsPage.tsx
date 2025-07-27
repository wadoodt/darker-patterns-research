import { Button, Flex, Text } from "@radix-ui/themes";
import { useAuth } from "@hooks/useAuth";
import { useApp } from "@hooks/useApp";
import { useTranslation } from "react-i18next";
import SettingSection from "@components/SettingSection";

const SettingsPage: React.FC = () => {
  const { hasRole } = useAuth();
  const { t } = useTranslation();
  const { isHighContrast } = useApp();

  return (
    <div>
      <h1>Admin Settings</h1>
      <p>Manage application-wide settings and feature flags here.</p>

      {hasRole(["super-admin"]) && (
        <SettingSection title={t("config.system.title")}>
          <Flex direction="column" gap="2">
            <Text>{t("config.system.warning")}</Text>
            <Button color="red" variant="soft" highContrast={isHighContrast}>
              {t("config.system.shutdown")}
            </Button>
          </Flex>
        </SettingSection>
      )}
    </div>
  );
};

export default SettingsPage;
