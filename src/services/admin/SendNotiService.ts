import axios from "@/lib/axios";

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

export interface UserFilterParams {
	page?: number;
	limit?: number;
	fromDate?: object;
	toDate?: object;
	email?: string;
	status?: string;
}

export const getAllUsers = async (params?: UserFilterParams): Promise<any> => {
	const response = await axios.get<any>('/users/filter', { params });
	return response.data;
};

export interface SendNotificationPayload {
	userIds: string[];
	title: string;
	message: string;
}

export const sendNotificationToUsers = async (payload: SendNotificationPayload): Promise<any> => {
	const response = await axios.post("/notifications/send-to-users", payload);
	return response.data;
};

export interface Notification {
	notificationId: string;
	userId: string;
	title: string;
	message: string;
	createdAt: string;
	isRead: boolean;
}

export const getUserNotifications = async (): Promise<Notification[]> => {
	const response = await axios.get<Notification[]>("/notifications/event");
	return response.data;
};