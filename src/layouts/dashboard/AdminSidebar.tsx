import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styles from './AdminSidebar.module.css';
import { adminNavigation, dashboardNavigation } from '@pages/dashboard/navigation';
import type { NavigationItem } from '@pages/dashboard/navigation';
import type { AuthenticatedUser } from "types/auth";

interface AdminSidebarProps {
  user: AuthenticatedUser;
  path: string;
  isOpen: boolean;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ path, user, isOpen }) => {
  const location = useLocation();
  const { t } = useTranslation();

  const navigation = [...adminNavigation, ...dashboardNavigation].filter((item) => {
    return item.roles?.includes(user.role);
  });

  return (
    <div className={`${styles.sidebar} ${!isOpen ? styles.sidebarClosed : ''}`}>
      <div className={styles.sidebarHeader}>
        <div className={styles.logo}>
          <img
            src="/images/penguin_logo_placeholder.png"
            alt="Penguin Mails Logo"
            className={styles.logoIcon}
          />
          <span className={styles.logoText}>PenguinMails</span>
        </div>
        <p className={styles.logoSubtext}>{path === '/admin-panel' ? t('sidebar.admin.title') : t('sidebar.dashboard.title')}</p>
      </div>
      <nav className={styles.nav}>
        {navigation.map((item: NavigationItem) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.href;
          
          return (
            <Link
              key={item.name}
              to={item.href}
              className={`${styles.navLink} ${isActive ? styles.navLinkActive : ''}`}>
              <Icon className={styles.navIcon} />
              {t(item.name)}
            </Link>
          );
        })}
      </nav>
      <div className={styles.footer}>
        <div className={styles.statusBox}>
          <p className={styles.statusTitle}>{t('sidebar.status.title')}</p>
          <p className={styles.statusText}>{t('sidebar.status.allSystemsOperational')}</p>
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;
