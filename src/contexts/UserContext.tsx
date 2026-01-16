"use client";
import { createContext, useContext, useState, ReactNode } from 'react';
import { getUserByInformation } from '@/services/UserService';

interface User {
	id: string;
	name: string;
	phone: string;
	[key: string]: any;
}

interface UserContextType {
	user: User | null;
	loading: boolean;
	error: string | null;
	fetchUserByInformation: (information: string) => Promise<void>;
	setUser: (user: User | null) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const fetchUserByInformation = async (information: string) => {
		setLoading(true);
		setError(null);
		try {
			const data = await getUserByInformation(information);
			setUser(data);
		} catch (err: any) {
			setError(err?.response?.data?.message || 'Không tìm thấy user');
			setUser(null);
		} finally {
			setLoading(false);
		}
	};

	return (
		<UserContext.Provider value={{ user, loading, error, fetchUserByInformation, setUser }}>
			{children}
		</UserContext.Provider>
	);
};

export const useUserContext = () => {
	const context = useContext(UserContext);
	if (!context) {
		throw new Error('useUserContext must be used within a UserProvider');
	}
	return context;
};
