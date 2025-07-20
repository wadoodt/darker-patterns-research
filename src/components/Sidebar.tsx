import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styles from './Sidebar.module.css';
import clsx from 'clsx';
import { useAuth } from '@hooks/useAuth';

interface SidebarProps {
  isOpen: boolean;
}

interface NavLink {
  name: string;
  path: string;
}

// Simplified user type for role checking
type AuthUser = {
  role?: string | string[];
  roles?: string | string[];
};

const useNavigationLinks = () => {
  const { t } = useTranslation();
  
  const dashboardLinks: NavLink[] = [
    { name: t('sidebar.dashboard.home'), path: '/dashboard' },
    { name: t('sidebar.dashboard.settings'), path: '/dashboard/settings' },
    { name: t('sidebar.dashboard.team'), path: '/dashboard/team' },
    { name: t('sidebar.dashboard.billing'), path: '/dashboard/billing' },
    { name: t('sidebar.dashboard.infra'), path: '/dashboard/infra' },
    { name: t('sidebar.dashboard.domains'), path: '/dashboard/domains' },
  ];

  const adminLinks: NavLink[] = [
    { name: t('sidebar.admin.home'), path: '/admin-panel' },
    { name: t('sidebar.admin.settings'), path: '/admin-panel/settings' },
    { name: t('sidebar.admin.users'), path: '/admin-panel/users' },
    { name: t('sidebar.admin.companies'), path: '/admin-panel/companies' },
    { name: t('sidebar.admin.infra'), path: '/admin-panel/infra' },
  ];

  const userLinks: NavLink[] = [
    { name: t('sidebar.user.profile'), path: '/dashboard/profile' },
    { name: t('sidebar.user.settings'), path: '/dashboard/settings' },
  ];

  return { dashboardLinks, adminLinks, userLinks };
};

interface NavSectionProps {
  title?: string;
  links: NavLink[];
}

const NavSection = ({ title, links }: NavSectionProps) => {
  const location = useLocation();
  return (
    <>
      {title && <h4>{title}</h4>}
      <ul>
        {links.map((link) => (
          <li key={link.name}>
            <Link
              to={link.path}
              className={clsx(styles.navLink, {
                [styles.active]: location.pathname === link.path,
              })}
            >
              {link.name}
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
};

const Sidebar = ({ isOpen }: SidebarProps) => {
  const { user } = useAuth() as { user: AuthUser | null };
  const { dashboardLinks, adminLinks, userLinks } = useNavigationLinks();
  const { t } = useTranslation();

  if (!user) {
    return null; // Or a loading/error state
  }

  const hasRole = (roles: string[]): boolean => {
    // Check both 'role' and 'roles' for backward compatibility
    const userRoles = user.role || user.roles;
    if (!userRoles) return false;
    
    const rolesArray = Array.isArray(userRoles) 
      ? userRoles 
      : typeof userRoles === 'string' 
        ? [userRoles] 
        : [];
        
    return roles.some(role => rolesArray.includes(role));
  };

  return (
    <aside className={clsx(styles.sidebar, { [styles.sidebarClosed]: !isOpen })}>
      <nav className={styles.nav}>
        {hasRole(['user']) && <NavSection links={userLinks} />}
        {hasRole(['admin', 'super-admin', 'qa']) && (
          <NavSection title={t('sidebar.dashboard.title')} links={dashboardLinks} />
        )}
        {hasRole(['super-admin', 'qa']) && (
          <>
            <hr style={{ margin: '1rem 0' }} />
            <NavSection title={t('sidebar.admin.title')} links={adminLinks} />
          </>
        )}
      </nav>
    </aside>
  );
};

export default Sidebar;
