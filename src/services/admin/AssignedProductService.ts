import axios from '@/lib/axios';

// Lấy danh sách sản phẩm đã phân công về một điểm thu gom cụ thể trong ngày
export interface AssignedPointProductsResponse {
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

export const getAssignedProductsByCollectionPoint = async (
	smallPointId: string,
	workDate: string,
	page?: number,
	limit?: number
): Promise<AssignedPointProductsResponse> => {
	const params: any = { workDate };
	if (page !== undefined) params.page = page;
	if (limit !== undefined) params.limit = limit;
	const response = await axios.get(
		`/product-query/small-point/${smallPointId}`,
		{ params }
	);
	return response.data;
};

// Lấy tổng hợp sản phẩm đã phân công về các điểm thu gom theo ngày
export const getAssignedCollectionPointsSummary = async (workDate: string): Promise<any> => {
	const response = await axios.get('/product-query/daily-summary', {
		params: { workDate },
	});
	return response.data;
};
