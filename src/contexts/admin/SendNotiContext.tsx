import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { getAllUsers, sendNotificationToUsers, getUserNotifications, User, Notification, SendNotificationPayload, UserFilterParams } from '@/services/admin/SendNotiService';

interface SendNotiContextType {
  users: User[];
  notifications: Notification[];
  loading: boolean;
  fetchUsers: (params?: UserFilterParams) => Promise<void>;
  sendNotification: (payload: SendNotificationPayload) => Promise<void>;
  fetchNotifications: () => Promise<void>;
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  limit: number;
  setLimit: React.Dispatch<React.SetStateAction<number>>;
  totalPages: number;
}

const SendNotiContext = createContext<SendNotiContextType | undefined>(undefined);

type Props = { children: ReactNode };

export const SendNotiProvider: React.FC<Props> = ({ children }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [totalPages, setTotalPages] = useState<number>(1);


  const fetchUsers = useCallback(async (params?: UserFilterParams) => {
    setLoading(true);
    try {
      const query = {
        page: params?.page ?? page,
        limit: params?.limit ?? limit,
        status: 'Đang hoạt động',
        ...params,
      };
      const res = await getAllUsers(query);
      setUsers(res.data || []);
      // Only update pagination state if not fetching all users
      if (query.limit !== 10000) {
        setTotalPages(res.totalPages || 1);
        setPage(res.page || 1);
        setLimit(res.limit || 10);
      }
      return res;
    } catch (err) {
      setUsers([]);
      if (params?.limit !== 10000) {
        setTotalPages(1);
        setPage(1);
        setLimit(10);
      }
      console.error('fetchUsers error', err);
      return { data: [], totalPages: 1 };
    } finally {
      setLoading(false);
    }
  }, [page, limit]);

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const notis = await getUserNotifications();
      setNotifications(notis || []);
    } catch (err) {
      setNotifications([]);
      console.error('fetchNotifications error', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const sendNotification = useCallback(async (payload: SendNotificationPayload) => {
    setLoading(true);
    try {
      await sendNotificationToUsers(payload);
      await fetchNotifications();
    } catch (err) {
      console.error('sendNotification error', err);
    } finally {
      setLoading(false);
    }
  }, [fetchNotifications]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const value: SendNotiContextType = {
    users,
    notifications,
    loading,
    fetchUsers,
    sendNotification,
    fetchNotifications,
    page,
    setPage,
    limit,
    setLimit,
    totalPages,
  };

  return (
    <SendNotiContext.Provider value={value}>{children}</SendNotiContext.Provider>
  );
};

export const useSendNotiContext = (): SendNotiContextType => {
  const ctx = useContext(SendNotiContext);
  if (!ctx) throw new Error('useSendNotiContext must be used within SendNotiProvider');
  return ctx;
};

export default SendNotiContext;
