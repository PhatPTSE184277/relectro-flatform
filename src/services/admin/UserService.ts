import axios from '@/lib/axios';

export interface User {
	userId: string;
	name: string;
	email: string;
	phone: string;
	avatar: string;
	createAt?: string;
	role: string;
	smallCollectionPointId: number;
	collectionCompanyId: number;
	status: string | null;
}


export interface UserFilterParams {
	page?: number;
	limit?: number;
	fromDate?: object;
	toDate?: object;
	email?: string;
	status?: string;
}

export interface UserFilterResponse {
	data: User[];
	totalItems: number;
	totalPages: number;
	page: number;
	limit: number;
}

export const getAllUsers = async (params?: UserFilterParams): Promise<UserFilterResponse> => {
	const response = await axios.get<UserFilterResponse>('/users/filter', { params });
	return response.data;
};

export const banUser = async (userId: string): Promise<void> => {
  await axios.delete(`/users/ban/${userId}`);
};
