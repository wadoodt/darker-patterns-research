import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import { Theme } from '@radix-ui/themes';
import { useApp } from '@hooks/useApp';
import Header from '@components/Header';
import Sidebar from '@components/Sidebar';
import styles from './DashboardLayout.module.css';
import clsx from 'clsx';

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { settings } = useApp();

  const isHighContrast = settings.theme.includes('high-contrast');
  const appearance = settings.theme.includes('dark') ? 'dark' : 'light';

  return (
    <Theme
      appearance={appearance}
      grayColor="sand"
      panelBackground="solid"
      scaling="100%"
      radius="medium"
    >
      <div className={clsx(styles.dashboardLayout, { 'radix-themes-high-contrast': isHighContrast })}>
        <div className={styles.header}>
          <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        </div>
        <div className={clsx(styles.sidebar, { [styles.sidebarOpen]: sidebarOpen, [styles.sidebarClosed]: !sidebarOpen })}>
          <Sidebar isOpen={sidebarOpen} />
        </div>
        <main className={styles.main}>
          <Outlet />
        </main>
      </div>
    </Theme>
  );
}
