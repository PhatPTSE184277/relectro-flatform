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

export type UserContextType = {
    users: User[];
    loading: boolean;
    fetchUsers: () => Promise<void>;
    setUsers: React.Dispatch<React.SetStateAction<User[]>>;
    selectedUser: User | null;
    setSelectedUser: React.Dispatch<React.SetStateAction<User | null>>;
};

const UserContext = createContext<UserContextType | undefined>(undefined);


type Props = { children: ReactNode };

export const UserProvider: React.FC<Props> = ({ children }) => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    const fetchUsers = useCallback(async () => {
        setLoading(true);
        try {
            const data = await getAllUsers();
            setUsers(data);
        } catch (err) {
            setUsers([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        void fetchUsers();
    }, [fetchUsers]);

    const value: UserContextType = {
        users,
        loading,
        fetchUsers,
        setUsers,
        selectedUser,
        setSelectedUser,
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