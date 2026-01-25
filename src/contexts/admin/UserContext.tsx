'use client';

import React, {
    createContext,
    useState,
    useCallback,
    useContext,
    useEffect,
    ReactNode
} from 'react';
import { getAllUsers, User, banUser } from '@/services/admin/UserService';
import type { UserFilterParams, UserFilterResponse } from '@/services/admin/UserService';

export type UserContextType = {
    users: User[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    loading: boolean;
    fetchUsers: (params?: UserFilterParams) => Promise<void>;
    setUsers: React.Dispatch<React.SetStateAction<User[]>>;
    selectedUser: User | null;
    setSelectedUser: React.Dispatch<React.SetStateAction<User | null>>;
    setPage: React.Dispatch<React.SetStateAction<number>>;
    setLimit: React.Dispatch<React.SetStateAction<number>>;
    filterParams: UserFilterParams;
    setFilterParams: React.Dispatch<React.SetStateAction<UserFilterParams>>;
    handleBanUser: (userId: string) => Promise<void>;
    stats: {
        total: number;
        active: number;
        inactive: number;
    };
};

const UserContext = createContext<UserContextType | undefined>(undefined);


type Props = { children: ReactNode };


export const UserProvider: React.FC<Props> = ({ children }) => {
    const [users, setUsers] = useState<User[]>([]);
    const [total, setTotal] = useState<number>(0);
    const [page, setPage] = useState<number>(1);
    const [limit, setLimit] = useState<number>(10);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [filterParams, setFilterParams] = useState<UserFilterParams>({});
    const [stats, setStats] = useState({
        total: 0,
        active: 0,
        inactive: 0,
    });

    const fetchUsers = useCallback(async (params?: UserFilterParams) => {
        setLoading(true);
        try {
            const query = {
                page,
                limit,
                ...filterParams,
                ...params,
            };
            const data: UserFilterResponse = await getAllUsers(query);
            setUsers(data.data);
            setTotal(data.totalItems);
            setTotalPages(data.totalPages);
            setPage(data.page);
            setLimit(data.limit);
            
            // Update stats
            const active = data.data.filter(u => u.status === 'Đang hoạt động').length;
            const inactive = data.data.filter(u => u.status === 'Không hoạt động').length;
            setStats({
                total: data.totalItems,
                active: active,
                inactive: inactive,
            });
        } catch (err) {
            console.log(err);
            setUsers([]);
            setTotal(0);
            setTotalPages(0);
        } finally {
            setLoading(false);
        }
    }, [page, limit, filterParams]);

    useEffect(() => {
        fetchUsers();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, limit, filterParams]);

    const handleBanUser = useCallback(async (userId: string) => {
        setLoading(true);
        try {
            await banUser(userId);
            await fetchUsers();
        } catch (err) {
            console.error('Error banning user:', err);
        } finally {
            setLoading(false);
        }
    }, [fetchUsers]);

    const value: UserContextType = {
        users,
        total,
        page,
        limit,
        totalPages,
        loading,
        fetchUsers,
        setUsers,
        selectedUser,
        setSelectedUser,
        setPage,
        setLimit,
        filterParams,
        setFilterParams,
        handleBanUser,
        stats,
    };

    return (
        <UserContext.Provider value={value}>{children}</UserContext.Provider>
    );
};


export const useUserContext = (): UserContextType => {
    const ctx = useContext(UserContext);
    if (!ctx)
        throw new Error('useUserContext must be used within UserProvider');
    return ctx;
};

export default UserContext;