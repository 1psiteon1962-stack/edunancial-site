import { Notification } from "@/types/notifications";

const notifications: Notification[] = [];

export function getNotifications() {

  return notifications;

}

export function addNotification(
  notification: Notification
) {

  notifications.unshift(notification);

}

export function markAsRead(
  id: string
) {

  const notification = notifications.find(
    item => item.id === id
  );

  if (notification) {

    notification.read = true;

  }

}

export function unreadCount() {

  return notifications.filter(
    notification => !notification.read
  ).length;

}
