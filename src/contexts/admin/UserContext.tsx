'use client';

import React, {
    createContext,
    useState,
    useCallback,
    useContext,
    useEffect,
    ReactNode
} from 'react';
import { getAllUsers, User } from '@/services/admin/UserService';
import type { UserFilterParams, UserFilterResponse } from '@/services/admin/UserService';

export type UserContextType = {
    users: User[];
    total: number;
    page: number;
    limit: number;
    loading: boolean;
    fetchUsers: (params?: UserFilterParams) => Promise<void>;
    setUsers: React.Dispatch<React.SetStateAction<User[]>>;
    selectedUser: User | null;
    setSelectedUser: React.Dispatch<React.SetStateAction<User | null>>;
    setPage: React.Dispatch<React.SetStateAction<number>>;
    setLimit: React.Dispatch<React.SetStateAction<number>>;
    filterParams: UserFilterParams;
    setFilterParams: React.Dispatch<React.SetStateAction<UserFilterParams>>;
};

const UserContext = createContext<UserContextType | undefined>(undefined);


type Props = { children: ReactNode };


export const UserProvider: React.FC<Props> = ({ children }) => {
    const [users, setUsers] = useState<User[]>([]);
    const [total, setTotal] = useState<number>(0);
    const [page, setPage] = useState<number>(1);
    const [limit, setLimit] = useState<number>(10);
    const [loading, setLoading] = useState<boolean>(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [filterParams, setFilterParams] = useState<UserFilterParams>({});

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
            setTotal(data.total);
            setPage(data.page);
            setLimit(data.limit);
        } catch (err) {
            console.log(err);
            setUsers([]);
            setTotal(0);
        } finally {
            setLoading(false);
        }
    }, [page, limit, filterParams]);

    useEffect(() => {
        fetchUsers();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, limit, filterParams]);

    const value: UserContextType = {
        users,
        total,
        page,
        limit,
        loading,
        fetchUsers,
        setUsers,
        selectedUser,
        setSelectedUser,
        setPage,
        setLimit,
        filterParams,
        setFilterParams,
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