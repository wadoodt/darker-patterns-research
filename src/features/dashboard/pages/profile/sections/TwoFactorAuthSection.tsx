import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Box, Heading, Text, Card, Switch } from "@radix-ui/themes";
import { Check } from "lucide-react";
import styles from "./TwoFactorAuthSection.module.css";

export function TwoFactorAuthSection() {
  const { t } = useTranslation();
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  return (
    <Card className={styles.card}>
      <div className={styles.header}>
        <Box>
          <Heading as="h3" size="4" className={styles.title}>
            {t("profile.security.twoFactorAuth.title")}
          </Heading>
          <Text size="2" color="gray">
            {t("profile.security.twoFactorAuth.description")}
          </Text>
        </Box>
        <div className={styles.status}>
          <Text
            size="2"
            weight="medium"
            className={
              twoFactorEnabled ? styles.statusEnabled : styles.statusDisabled
            }
          >
            {t(`profile.security.twoFactorAuth.status`, {
              context: twoFactorEnabled ? "enabled" : "disabled",
            })}
          </Text>
          <Switch
            checked={twoFactorEnabled}
            onCheckedChange={setTwoFactorEnabled}
            aria-label={t("profile.security.twoFactorAuth.enableLabel")}
          />
        </div>
      </div>
      {twoFactorEnabled && (
        <Box className={styles.alert}>
          <div className={styles.alertContent}>
            <Check
              size={16}
              style={{
                color: "var(--green-9)",
                flexShrink: 0,
                marginTop: "2px",
              }}
            />
            <Text size="2" weight="medium">
              {t("profile.security.twoFactorAuth.activeMessage")}
            </Text>
          </div>
          <Text size="2">
            {t("profile.security.twoFactorAuth.protectedMessage")}
          </Text>
        </Box>
      )}
    </Card>
  );
}
