'use client';

import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNotificationHub } from '@/hooks/useNotificationHub';
import { getUserNotifications, markNotificationAsRead, markAllNotificationsAsRead } from '@/services/NotificationService';

export interface Notification {
    notificationId: string;
    userId: string;
    title: string;
    message: string;
    isRead: boolean;
    createdAt: string;
}

interface NotificationContextType {
    notifications: Notification[];
    unreadCount: number;
    loading: boolean;
    fetchNotifications: () => Promise<void>;
    markAsRead: (notificationId: string) => Promise<void>;
    markAllAsRead: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchNotifications = useCallback(async () => {
        if (!user?.userId) return;
        
        setLoading(true);
        try {
            const data = await getUserNotifications(user.userId);
            setNotifications(data);
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
        } finally {
            setLoading(false);
        }
    }, [user?.userId]);

    const markAsRead = useCallback(async (notificationId: string) => {
        try {
            await markNotificationAsRead([notificationId]);
            setNotifications(prev => 
                prev.map(n => n.notificationId === notificationId ? { ...n, isRead: true } : n)
            );
        } catch (error) {
            console.error('Failed to mark notification as read:', error);
        }
    }, []);

    const markAllAsRead = useCallback(async () => {
        if (!user?.userId) return;
        
        const unreadIds = notifications.filter(n => !n.isRead).map(n => n.notificationId);
        if (unreadIds.length === 0) return;
        
        try {
            await markAllNotificationsAsRead(unreadIds);
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        } catch (error) {
            console.error('Failed to mark all notifications as read:', error);
        }
    }, [user?.userId, notifications]);

    // Lắng nghe notification real-time
    const handleNewNotification = useCallback((data: any) => {
        console.log('SignalR notification received:', data);
        
        // Thay vì tự parse notification, gọi lại fetchNotifications để lấy data đúng từ server
        if (user?.userId) {
            fetchNotifications();
        }
    }, [user?.userId, fetchNotifications]);

    // Kết nối SignalR
    useNotificationHub({
        onAssignCompleted: handleNewNotification,
        token: typeof window !== 'undefined' ? (localStorage.getItem('ewise_token') || sessionStorage.getItem('ewise_token') || '') : '',
        userId: user?.userId || ''
    });

    // Fetch notifications khi user login
    useEffect(() => {
        if (user?.userId) {
            fetchNotifications();
        }
    }, [user?.userId, fetchNotifications]);

    const unreadCount = notifications.filter(n => !n.isRead).length;

    const value: NotificationContextType = {
        notifications,
        unreadCount,
        loading,
        fetchNotifications,
        markAsRead,
        markAllAsRead
    };

    return (
        <NotificationContext.Provider value={value}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotifications = (): NotificationContextType => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotifications must be used within NotificationProvider');
    }
    return context;
};
