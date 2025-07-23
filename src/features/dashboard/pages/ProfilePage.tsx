import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Box, Flex, Heading, Text, Button } from "@radix-ui/themes";
import { User, Shield, Bell } from "lucide-react";

import { GeneralTab } from "./profile/sections/GeneralTab";
import { SecurityTab } from "./profile/sections/SecurityTab";
import { NotificationsTab } from "./profile/sections/NotificationsTab";
import styles from "./profile/ProfilePage.module.css";

type TabId = "general" | "security" | "notifications";

export default function ProfilePage() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<TabId>("general");

  const tabs = [
    { id: "general", label: t("profile.tabs.general"), icon: User },
    { id: "security", label: t("profile.tabs.security"), icon: Shield },
    { id: "notifications", label: t("profile.tabs.notifications"), icon: Bell },
  ];

  return (
    <Flex className={styles.profileContainer}>
      {/* Sidebar */}
      <Box className={styles.sidebar}>
        <Box className={styles.sidebarHeader}>
          <Heading as="h1" size="4">
            {t("profile.title")}
          </Heading>
        </Box>

        <nav className={styles.sidebarNav}>
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <Button
                key={tab.id}
                variant="ghost"
                color="gray"
                onClick={() => setActiveTab(tab.id as TabId)}
                className={`${styles.tabButton} ${isActive ? styles.active : ""}`}
              >
                <Icon className={styles.icon} />
                <Text as="span" weight="medium">
                  {tab.label}
                </Text>
              </Button>
            );
          })}
        </nav>
      </Box>

      {/* Content */}
      <Box className={styles.contentArea}>
        {activeTab === "general" && <GeneralTab />}
        {activeTab === "security" && <SecurityTab />}
        {activeTab === "notifications" && <NotificationsTab />}
      </Box>
    </Flex>
  );
}
