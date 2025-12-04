import axios from '@/lib/axios';

export interface User {
	userId: string;
	name: string;
	email: string;
	phone: string;
	avatar: string;
	role: string;
	smallCollectionPointId: number;
	collectionCompanyId: number;
	status: string | null;
}

export const getAllUsers = async (): Promise<User[]> => {
	const response = await axios.get<User[]>('/users');
	return response.data;
};
