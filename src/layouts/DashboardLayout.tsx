import { useState } from "react";
import Header from "@layouts/dashboard/Header";
import { Theme } from "@radix-ui/themes";
import AdminSidebar from "@layouts/dashboard/AdminSidebar";
import styles from "@layouts/DashboardLayout.module.css";
import clsx from "clsx";

import { useApp } from "@hooks/useApp";
import type { AuthenticatedUser } from "types/auth";

interface DashboardLayoutProps {
  path: string;
  user: AuthenticatedUser;
  children: React.ReactNode;
}

const DashboardLayout = ({ path, user, children }: DashboardLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { settings } = useApp();

  const isHighContrast = settings.theme.includes("high-contrast");
  const appearance = settings.theme.includes("dark") ? "dark" : "light";
  return (
    <Theme
      appearance={appearance}
      grayColor="sand"
      panelBackground="solid"
      scaling="100%"
      radius="medium"
    >
      <div className={styles.adminLayout}>
        <div
          className={clsx(styles.sidebar, {
            [styles.sidebarOpen]: sidebarOpen,
            [styles.sidebarClosed]: !sidebarOpen,
            "radix-themes-high-contrast": isHighContrast,
          })}
        >
          <AdminSidebar path={path} user={user} isOpen={sidebarOpen} />
        </div>
        <div className={styles.mainContent}>
          <Header
            onMenuClick={() => setSidebarOpen(!sidebarOpen)}
          />
          <main className={styles.main}>{children}</main>
        </div>
      </div>
    </Theme>
  );
};

export default DashboardLayout;
