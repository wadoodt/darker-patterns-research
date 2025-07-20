import React from "react";
import { Bell, Search, LogOut, User } from "lucide-react";
import { useAuth } from "@hooks/useAuth";
import styles from "./Header.module.css";

import { Link } from "react-router-dom";

interface HeaderProps {
  onMenuClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
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
          {/* <h1 className={styles.title}>{path === "/admin-panel" ? "Admin Panel" : "User Dashboard"}</h1> */}
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

          <button className={styles.notificationButton}>
            <Bell className={styles.notificationIcon} />
            <span className={styles.notificationBadge}>3</span>
          </button>

          <Link to="/dashboard/profile" className={styles.userContainerLink}>
            <div className={styles.userContainer}>
              <div className={styles.userInfo}>
                <p className={styles.userName}>{user?.name}</p>
                <p className={styles.userRole}>{user?.role}</p>
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

export default Header;
