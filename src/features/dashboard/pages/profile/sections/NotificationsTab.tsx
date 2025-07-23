import { Box, Heading, Text, Card, Flex, Switch } from "@radix-ui/themes";
import { useTranslation } from "react-i18next";
import styles from "./NotificationsTab.module.css";

export function NotificationsTab() {
  const { t } = useTranslation();

  const notificationOptions = [
    { key: "newReplies", defaultChecked: true },
    { key: "campaignStatus", defaultChecked: true },
    { key: "weeklyReports", defaultChecked: true },
    { key: "domainAlerts", defaultChecked: true },
    { key: "warmupCompletion", defaultChecked: false },
    { key: "silenceWebapp", defaultChecked: false },
    { key: "onlyUrgent", defaultChecked: false },
  ];

  return (
    <Box className={styles.container}>
      <Box>
        <Heading as="h2" size="7" weight="bold">
          {t("profile.notifications.title")}
        </Heading>
        <Text color="gray">{t("profile.notifications.description")}</Text>
      </Box>

      <Card>
        <Heading as="h3" size="4" mb="4">
          {t("profile.notifications.emailNotifications")}
        </Heading>
        <Flex direction="column" gap="4">
          {notificationOptions.map((item) => (
            <Text
              as="label"
              size="2"
              key={item.key}
              className={styles.switchLabel}
            >
              <Switch defaultChecked={item.defaultChecked} />
              <span>{t(`profile.notifications.options.${item.key}`)}</span>
            </Text>
          ))}
        </Flex>
      </Card>
    </Box>
  );
}
