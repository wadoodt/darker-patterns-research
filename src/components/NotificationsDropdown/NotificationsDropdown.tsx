import { useState, useCallback, useEffect } from 'react';
import { 
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuGroup,
} from '@radix-ui/react-dropdown-menu';

import { Bell, X, Clock, Send, BarChart3, AlertTriangle, Check, Info, CreditCard, User, type LucideIcon } from 'lucide-react';
import { useNotifications } from '@contexts/NotificationsContext';
import type { Notification } from '@api/domains/notifications/types';
import styles from './NotificationsDropdown.module.css';
import { Button } from '@radix-ui/themes';

const NotificationIcon = ({ type }: { type: Notification['type'] }) => {
  const icons: Record<Notification['type'], LucideIcon> = {
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

export default function NotificationsDropdown() {
  const { 
    notifications, 
    loading, 
    hasMore,
    unreadCount,
    markAsRead,
    markAllAsRead,
    fetchMore,
    error,
    enable
  } = useNotifications();
  
  const [isOpen, setIsOpen] = useState(false);
  const [hasEnabled, setHasEnabled] = useState(false);

  useEffect(() => {
    if (isOpen && !hasEnabled) {
      enable();
      setHasEnabled(true);
    }
  }, [isOpen, enable, hasEnabled]);

  const handleNotificationClick = useCallback(async (notification: Notification) => {
    await markAsRead(notification.id);
    // Handle navigation if needed
  }, [markAsRead]);

  const handleFetchMore = useCallback(async () => {
    await fetchMore();
  }, [fetchMore]);

  const handleMarkAllAsRead = useCallback(async () => {
    await markAllAsRead();
  }, [markAllAsRead]);

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
              <Button className={styles.markAllButton} onClick={handleMarkAllAsRead} disabled={loading}>
                Mark all as read
              </Button>
            )}
            <Button 
              className={styles.closeButton} 
              onClick={() => setIsOpen(false)}
              aria-label="Close notifications"
            >
              <X size={16} />
            </Button>
          </div>
        </div>

        <DropdownMenuGroup>
          {error && (
            <div className={styles.error}>Error: {error}</div>
          )}
          {
            loading && <div className={styles.loading}>Loading...</div>
          }
          {
            !loading && !Array.isArray(notifications) && (
              <div className={styles.error}>Error: {error}</div>
            )
          }
          {
            !loading && Array.isArray(notifications) && notifications.length === 0 && (
              <div className={styles.empty}>No notifications</div>
            )
          }
          {
            !loading && Array.isArray(notifications) && notifications.length > 0 && (
              <>
                {notifications.map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    onClick={handleNotificationClick}
                  />
                ))}
                {hasMore && (
                <Button className={styles.loadMoreButton} onClick={handleFetchMore}>
                  Load more
                </Button>
              )}
              </>
            )
          }
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
