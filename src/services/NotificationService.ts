import axios from '@/lib/axios';

export interface Notification {
    notificationId: string;
    userId: string;
    title: string;
    message: string;
    isRead: boolean;
    createdAt: string;
}

// Lấy danh sách thông báo của user
export const getUserNotifications = async (userId: string): Promise<Notification[]> => {
    const response = await axios.get<Notification[]>(`/notifications/user/${userId}`);
    return response.data;
};

// Đánh dấu thông báo đã đọc
export const markNotificationAsRead = async (notificationIds: string[]): Promise<any> => {
    const response = await axios.put('/notifications/read', { notificationIds });
    return response.data;
};

// Đánh dấu tất cả thông báo đã đọc
export const markAllNotificationsAsRead = async (notificationIds: string[]): Promise<any> => {
    const response = await axios.put('/notifications/read', { notificationIds });
    return response.data;
};
