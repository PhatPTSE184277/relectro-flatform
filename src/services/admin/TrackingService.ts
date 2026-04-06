import axios from '@/lib/axios';

export interface PackageFilterParams {
	page?: number;
	limit?: number;
	companyId?: string;
	smallCollectionPointId?: string;
	fromDate?: string;
	toDate?: string;
	status?: string;
	packageId?: string;
}

export interface TrackingPackagesResponse {
	data: any[];
	totalPages: number;
	totalItems: number;
}

export const filterPackages = async (params: PackageFilterParams): Promise<TrackingPackagesResponse> => {
	const res = await axios.get('/packages/tracking', {
		params,
	});

	const payload = res.data;

	if (Array.isArray(payload)) {
		return {
			data: payload,
			totalPages: 1,
			totalItems: payload.length,
		};
	}

	return {
		data: payload?.data || [],
		totalPages: payload?.totalPages || 1,
		totalItems: payload?.totalItems || (payload?.data?.length ?? 0),
	};
};

export interface CollectionCompanyFilterParams {
	page?: number;
	limit?: number;
	status?: string;
}

export interface SmallCollectionFilterParams {
	page?: number;
	limit?: number;
	companyId?: string;
	status?: string;
}

export const filterCollectionCompanies = async (params: CollectionCompanyFilterParams) => {
	const res = await axios.get('/company/filter', {
		params,
	});
	return res.data;
};

export const filterSmallCollectionPoints = async (params: SmallCollectionFilterParams) => {
	const res = await axios.get('/small-collection/filter', {
		params,
	});
	return res.data;
};

export const getPackageDetail = async (packageId: string, page = 1, limit = 10) => {
	const res = await axios.get(`/packages/${packageId}`, {
		params: { page, limit },
	});
	return res.data;
};