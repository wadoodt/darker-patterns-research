import React from "react";
import { Search, LogOut, User } from "lucide-react";
import { useAuth } from "@hooks/useAuth";
import styles from "./Header.module.css";
import { Link } from "react-router-dom";
import NotificationsDropdown from "@components/NotificationsDropdown/NotificationsDropdown";
import { NotificationsProvider } from "@contexts/NotificationsContext";

interface HeaderProps {
  onMenuClick?: () => void;
}

const HeaderContent: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const { user, logout } = useAuth();

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.titleContainer}>
          <button onClick={onMenuClick} className={styles.menuButton}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
        </div>

        <div className={styles.actionsContainer}>
          <div className={styles.searchContainer}>
            <Search className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search users, campaigns..."
              className={styles.searchInput}
            />
          </div>

          <div className={styles.actions}>
            <NotificationsDropdown />
          </div>

          <Link to="/dashboard/profile" className={styles.userContainerLink}>
            <div className={styles.userContainer}>
              <div className={styles.userInfo}>
                <p className={styles.userName}>{user?.name}</p>
                <p className={styles.userRole}>{user?.platformRole}</p>
              </div>
              <div className={styles.userAvatar}>
                <User className={styles.userAvatarIcon} />
              </div>
            </div>
          </Link>
          <button onClick={logout} className={styles.logoutButton}>
            <LogOut className={styles.logoutIcon} />
          </button>
        </div>
      </div>
    </header>
  );
};

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  return (
    <NotificationsProvider>
      <HeaderContent onMenuClick={onMenuClick} />
    </NotificationsProvider>
  );
};

export default Header;
