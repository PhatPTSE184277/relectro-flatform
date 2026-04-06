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
	// Backend expects `FromDate`/`ToDate` in query (YYYY-MM-DD)
	FromDate?: string;
	ToDate?: string;
		// Backward-compatible legacy keys (will be normalized to FromDate/ToDate)
	fromDate?: unknown;
	toDate?: unknown;
	email?: string;
	status?: string;
}

type LegacyDateObject = {
	year?: number;
	month?: number;
	dayOfMonth?: number;
	day?: number;
};

function pad2(n: number) {
	return String(n).padStart(2, '0');
}

function normalizeDateToYmd(input: unknown): string | undefined {
	if (!input) return undefined;
	if (typeof input === 'string') return input;
	if (input instanceof Date && !Number.isNaN(input.getTime())) {
		const y = input.getFullYear();
		const m = pad2(input.getMonth() + 1);
		const d = pad2(input.getDate());
		return `${y}-${m}-${d}`;
	}
	if (typeof input === 'object') {
		const obj = input as LegacyDateObject;
		const y = obj.year;
		const m = obj.month;
		const d = obj.dayOfMonth ?? obj.day;
		if (typeof y === 'number' && typeof m === 'number' && typeof d === 'number') {
			return `${y}-${pad2(m)}-${pad2(d)}`;
		}
	}
	return undefined;
}

export const getAllUsers = async (params?: UserFilterParams): Promise<any> => {
	const normalizedParams: Record<string, unknown> = { ...(params || {}) };

	const from = normalizeDateToYmd((params as any)?.FromDate ?? (params as any)?.fromDate);
	const to = normalizeDateToYmd((params as any)?.ToDate ?? (params as any)?.toDate);

	if (from) normalizedParams.FromDate = from;
	if (to) normalizedParams.ToDate = to;

	delete (normalizedParams as any).fromDate;
	delete (normalizedParams as any).toDate;

	const response = await axios.get<any>('/users/filter', { params: normalizedParams });
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