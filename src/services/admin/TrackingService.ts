import axios from '@/lib/axios';

export interface ProductFilterParams {
	page?: number;
	limit?: number;
	fromDate?: string;
	toDate?: string;
	categoryName?: string;
	collectionCompanyId?: string;
}

export const filterProducts = async (params: ProductFilterParams) => {
	const res = await axios.get('/products/admin/filter', {
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

export const getProductTimeline = async (productId: string) => {
	const res = await axios.get(`/tracking/product/${productId}/timeline`);
	return res.data;
};