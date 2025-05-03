import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

/** @type {import('react').Context<{
 *   notifications: Array<{ id: number; type?: string; message: string; user: string; read: boolean; timestamp: string }>,
 *   unreadCount: number,
 *   addNotification: (notification: { type?: string; message: string; user: string }) => void,
 *   markAsRead: (id: number) => void,
 *   clearNotifications: () => void,
 *   getNotifications: (username: string) => Array<{ id: number; type?: string; message: string; user: string; read: boolean; timestamp: string }>,
 *   markNotificationsRead: (username: string) => void
 * }>} */
const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Load notifications from localStorage on mount
  useEffect(() => {
    try {
      const savedNotifications = localStorage.getItem('notifications');
      const savedUnreadCount = localStorage.getItem('unreadCount');

      if (savedNotifications) {
        const parsedNotifications = JSON.parse(savedNotifications);
        if (Array.isArray(parsedNotifications)) {
          setNotifications(parsedNotifications);
          const unread = parsedNotifications.filter(n => !n.read).length;
          setUnreadCount(Number(savedUnreadCount) || unread);
        } else {
          console.warn('Invalid notifications data, resetting to empty array');
          setNotifications([]);
          setUnreadCount(0);
          localStorage.removeItem('notifications');
          localStorage.removeItem('unreadCount');
        }
      }
    } catch (error) {
      console.error('Error loading notifications:', error);
      setNotifications([]);
      setUnreadCount(0);
      localStorage.removeItem('notifications');
      localStorage.removeItem('unreadCount');
    }
  }, []);

  // Sync localStorage with state changes
  useEffect(() => {
    localStorage.setItem('notifications', JSON.stringify(notifications));
    const currentUnread = notifications.filter(n => !n.read).length;
    if (unreadCount !== currentUnread) {
      setUnreadCount(currentUnread);
      localStorage.setItem('unreadCount', currentUnread);
    }
  }, [notifications]);

  // Memoized function to add a notification
  const addNotification = useCallback((notification) => {
    const newNotification = {
      ...notification,
      id: Date.now(),
      timestamp: new Date().toISOString(),
      read: false,
    };
    setNotifications(prev => [...prev, newNotification]);
  }, []);

  // Memoized function to mark a notification as read
  const markAsRead = useCallback((id) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  }, []);

  // Memoized function to clear all notifications
  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  // Memoized function to get notifications for a specific user
  const getNotifications = useCallback((username) => {
    return notifications.filter(notification => notification.user === username) || [];
  }, [notifications]);

  // Memoized function to mark all unread notifications for a user as read
  const markNotificationsRead = useCallback((username) => {
    const unreadUserNotifications = notifications.filter(
      n => n.user === username && !n.read
    );
    if (unreadUserNotifications.length > 0) {
      setNotifications(prev =>
        prev.map(notification =>
          notification.user === username && !notification.read
            ? { ...notification, read: true }
            : notification
        )
      );
    }
  }, [notifications]);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        clearNotifications,
        getNotifications,
        markNotificationsRead,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export { NotificationContext };

export default NotificationContext;