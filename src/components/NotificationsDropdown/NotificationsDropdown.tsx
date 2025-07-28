import { useState, useCallback } from 'react';
import { 
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuGroup
} from '@radix-ui/react-dropdown-menu';
import { Bell, X, Clock, Send, BarChart3, AlertTriangle, Check, Info, CreditCard, User } from 'lucide-react';
import { useNotifications } from '@contexts/NotificationsContext';
import type { Notification } from 'types/api/notifications';
import styles from './NotificationsDropdown.module.css';

const NotificationIcon = ({ type }: { type: Notification['type'] }) => {
  const icons = {
    reply: Send,
    system: Bell,
    user: User,
    payment: CreditCard,
    campaign: BarChart3,
    warning: AlertTriangle,
    success: Check,
    info: Info
  } as const;
  
  const Icon = icons[type];
  return <Icon size={16} />;
};

const NotificationItem = ({ 
  notification,
  onClick 
}: { 
  notification: Notification;
  onClick: (n: Notification) => void;
}) => (
  <DropdownMenuItem
    className={`${styles.notificationItem} ${!notification.read ? styles.unread : ''}`}
    onSelect={() => onClick(notification)}
  >
    <div className={styles.notificationContent}>
      <div className={`${styles.iconContainer} ${styles[notification.type]}`}>
        <NotificationIcon type={notification.type} />
      </div>
      <div className={styles.textContent}>
        <h4 className={styles.notificationTitle}>{notification.title}</h4>
        <p className={styles.notificationMessage}>{notification.message}</p>
        <div className={styles.time}>
          <Clock size={12} />
          {notification.updatedAt}
        </div>
      </div>
      {!notification.read && <div className={styles.unreadIndicator} />}
    </div>
  </DropdownMenuItem>
);

const NotificationList = ({ 
  notifications,
  loading,
  hasMore,
  onItemClick,
  onFetchMore
}: { 
  notifications: Notification[];
  loading: boolean;
  hasMore: boolean;
  onItemClick: (n: Notification) => void;
  onFetchMore: () => void;
}) => (
  <DropdownMenuGroup className={styles.notificationsList}>
    {notifications.length === 0 && !loading ? (
      <div className={styles.emptyState}>
        <Bell size={24} className={styles.emptyIcon} />
        <p className={styles.emptyTitle}>No notifications</p>
        <p className={styles.emptyMessage}>You're all caught up!</p>
      </div>
    ) : (
      notifications.map((notification) => (
        <NotificationItem key={notification.id} notification={notification} onClick={onItemClick} />
      ))
    )}
    
    {loading && (
      <div className={styles.loadingState}>
        <div className={styles.loadingSpinner} />
        <span>Loading notifications...</span>
      </div>
    )}
    
    {hasMore && !loading && notifications.length > 0 && (
      <button 
        className={styles.loadMoreButton}
        onClick={onFetchMore}
        disabled={loading}
      >
        Load more
      </button>
    )}
  </DropdownMenuGroup>
);

export default function NotificationsDropdown() {
  const { 
    notifications, 
    loading, 
    hasMore,
    unreadCount,
    markAsRead,
    fetchMore
  } = useNotifications();
  
  const [isOpen, setIsOpen] = useState(false);

  const handleNotificationClick = useCallback(async (notification: Notification) => {
    await markAsRead(notification.id);
    // Handle navigation if needed
  }, [markAsRead]);

  const handleFetchMore = useCallback(async () => {
    await fetchMore();
  }, [fetchMore]);

  const handleMarkAllAsRead = useCallback(async () => {
    // Implement mark all as read logic
  }, []);

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger className={styles.trigger} aria-label="Notifications">
        <Bell className={styles.icon} />
        {unreadCount > 0 && <span className={styles.badge} aria-hidden="true" />}
      </DropdownMenuTrigger>

      <DropdownMenuContent 
        className={styles.content} 
        align="end" 
        sideOffset={5}
      >
        <div className={styles.header}>
          <DropdownMenuLabel className={styles.title}>Notifications</DropdownMenuLabel>
          <div className={styles.actions}>
            {unreadCount > 0 && (
              <button 
                className={styles.markAllButton} 
                onClick={handleMarkAllAsRead}
                disabled={loading}
              >
                Mark all as read
              </button>
            )}
            <button 
              className={styles.closeButton} 
              onClick={() => setIsOpen(false)}
              aria-label="Close notifications"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        <NotificationList 
          notifications={notifications}
          loading={loading}
          hasMore={hasMore}
          onItemClick={handleNotificationClick}
          onFetchMore={handleFetchMore}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
