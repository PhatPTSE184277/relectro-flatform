import axios from '@/lib/axios';

export interface PackageFilterParams {
	page?: number;
	limit?: number;
	companyId?: string;
	fromDate?: string;
	toDate?: string;
	status?: string;
}

export const filterPackages = async (params: PackageFilterParams) => {
	const res = await axios.get('/packages/company/filter', {
		params,
	});
	return res.data;
};

export interface CollectionCompanyFilterParams {
	page?: number;
	limit?: number;
	status?: string;
}

export const filterCollectionCompanies = async (params: CollectionCompanyFilterParams) => {
	const res = await axios.get('/collection-company/filter', {
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