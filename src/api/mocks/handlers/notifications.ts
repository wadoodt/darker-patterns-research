import { db } from "../db";
import type { QueryOptions } from '../lib/createTable';
import type { Notification } from 'types/api/notifications';


interface NotificationTable {
  findFirst: (args: { where: { id?: string } }) => Notification | undefined;
  findMany: (args: QueryOptions<Notification>) => Notification[];
  update: (args: { where: { id: string }; data: Partial<Notification> }) => Notification | undefined;
  _reset: () => void;
  create: (data: Omit<Notification, 'id'> & { id?: string | number }) => Notification;
  delete: (args: { where: { id: string } }) => Notification | undefined;
}

const notifications = db.notifications as unknown as NotificationTable;

export async function getNotifications(request: Request) {
  const url = new URL(request.url);
  const page = Number(url.searchParams.get('page')) || 1;
  const limit = Number(url.searchParams.get('limit')) || 10;
  
  const notificationsList = notifications.findMany({ page, limit });
  
  return new Response(JSON.stringify(notificationsList), {
    headers: { 'Content-Type': 'application/json' },
    status: 200
  });
}

export async function markNotificationRead({ id }: { id: string }) {
  const notification = notifications.findFirst({ where: { id } });
  
  if (!notification) {
    return new Response(JSON.stringify({ code: 'NOT_FOUND', message: 'Notification not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  const updatedNotification = notifications.update({ where: { id }, data: { read: true } });
  return new Response(JSON.stringify(updatedNotification), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}

export async function markAllNotificationsRead() {
  db.notifications.findMany({}).forEach((n: Notification) => { n.read = true; });
  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}
