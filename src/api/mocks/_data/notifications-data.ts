import type { Notification } from "types/api/notifications";

export const mockNotifications: Notification[] = [
  {
    id: '1',
    userId: '1',
    type: 'reply',
    title: 'New reply',
    message: 'You received a reply to your comment',
    read: false,
    createdAt: '2021-01-01',
    updatedAt: '2021-01-01',
    action: {
      route: '/messages/1',
      label: 'View message'
    }
  },
  {
    id: '2',
    userId: '1',
    type: 'system',
    title: 'Campaign started',
    message: 'Your campaign "Summer Sale" has begun',
    read: false,
    createdAt: '2021-01-01',
    updatedAt: '2021-01-01',
    action: {
      route: '/campaigns/1',
      label: 'View campaign'
    }
  },
  {
    id: '3',
    userId: '1',
    type: 'payment',
    title: 'Low balance',
    message: 'Your account balance is running low',
    read: true,
    createdAt: '2021-01-01',
    updatedAt: '2021-01-01',
    action: {
      route: '/billing',
      label: 'View billing'
    }
  }
];
