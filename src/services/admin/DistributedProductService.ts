import axios from '@/lib/axios';

// Get list of products already distributed to a specific collection point on a given day
export interface DistributedPointProductsResponse {
	smallPointId: string;
	smallPointName: string;
	radiusMaxConfigKm: number;
	maxRoadDistanceKm: number;
	page: number;
	limit: number;
	totalItems: number;
	totalPages: number;
	totalWeightKg: number;
	totalVolumeM3: number;
	products: any[];
}

export const getDistributedProductsByCollectionPoint = async (
	smallPointId: string,
	workDate: string,
	page?: number,
	limit?: number
): Promise<DistributedPointProductsResponse> => {
	const params: any = { workDate };
	if (page !== undefined) params.page = page;
	if (limit !== undefined) params.limit = limit;
	const response = await axios.get(
		`/product-query/small-point/${smallPointId}`,
		{ params }
	);
	return response.data;
};

// Get summary of products already distributed to collection points by date
export const getDistributedCollectionPointsSummary = async (workDate: string): Promise<any> => {
	const response = await axios.get('/product-query/daily-summary', {
		params: { workDate },
	});
	return response.data;
};
