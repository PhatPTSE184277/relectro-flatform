import axios from '@/lib/axios';

export interface SpeedFilterParams {
	page?: number;
	limit?: number;
	search?: string;
}

export interface SpeedData {
	smallCollectionPointId: string;
	displayName: string;
	groupName: string;
	address?: string;
	value: number;
	status: string;
}

export interface FilterSpeedsResponse {
	page: number;
	limit: number;
	totalItems: number;
	totalPages: number;
	data: SpeedData[];
}

export const filterSpeeds = async ({
	page = 1,
	limit = 10,
	search,
}: {
	page?: number;
	limit?: number;
	search?: string;
}): Promise<FilterSpeedsResponse> => {
	const params: Record<string, any> = { page, limit };
	if (search && search.trim()) params.search = search.trim();

	const response = await axios.get<FilterSpeedsResponse>('/system-config/speed', {
		params,
	});
	return response.data;
};

export interface CreateSpeedPayload {
	smallCollectionPointId: string;
	speedKmh: number;
}

export const updateSpeed = async (payload: CreateSpeedPayload): Promise<any> => {
	const response = await axios.put('/system-config/speed', payload);
	return response.data;
};

export const createSpeed = async (payload: CreateSpeedPayload): Promise<any> => {
	const response = await axios.post('/system-config/speed', payload);
	return response.data;
};

export const getSpeedBySmallPointId = async (smallPointId: string): Promise<any> => {
    const response = await axios.get(`/system-config/speed/${smallPointId}`);
    return response.data;
};

const SpeedService = {
	filterSpeeds,
	updateSpeed,
	createSpeed,
	getSpeedBySmallPointId,
};

export default SpeedService;

