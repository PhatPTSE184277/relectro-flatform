
import axios from '@/lib/axios';
import { SmallCollectionPoint } from '@/types';

export type CollectionCompany = {
	id: string;
	name: string;
	companyEmail: string;
	phone: string;
	city: string;
	status: string;
};

export type Warehouse = {
	id: string;
	name: string;
	address: string;
	latitude: number;
	longitude: number;
	openTime: string;
	status: string;
	companyId: string | null;
};

export type CollectionCompanyDetail = CollectionCompany & {
	warehouses: Warehouse[];
};

export type PaginatedCollectionCompany = {
	page: number;
	limit: number;
	totalItems: number;
	totalPages: number;
	data: CollectionCompany[];
};

// API lấy tất cả công ty (không phân trang) - dùng cho dropdown/select
export const getCollectionCompanies = async (): Promise<CollectionCompany[]> => {
	const response = await axios.get('/collection-company');
	if (response.data.data && Array.isArray(response.data.data)) {
		return response.data.data;
	}
	return Array.isArray(response.data) ? response.data : [];
};

// API lấy công ty có phân trang và filter
export const getCollectionCompaniesFilter = async (
	page = 1,
	limit = 10,
	status?: string
): Promise<PaginatedCollectionCompany> => {
	const params: any = { page, limit };
	if (status) params.status = status;
	const response = await axios.get('/collection-company/filter', { params });
	return response.data;
};

export const getCollectionCompanyById = async (companyId: string): Promise<CollectionCompany> => {
  const response = await axios.get(`/collection-company/${companyId}`);
  return response.data;
};

export const importCollectionCompaniesFromExcel = async (file: File): Promise<any> => {
	const formData = new FormData();
	formData.append('file', file);
	const response = await axios.post('/collection-company/import-excel', formData, {
		headers: {
			'Content-Type': 'multipart/form-data',
		},
	});
	return response.data;
};

export interface SmallCollectionFilterParams {
	page?: number;
	limit?: number;
	companyId?: string;
	status?: string;
}

export type PaginatedSmallCollection = {
	page: number;
	limit: number;
	totalItems: number;
	totalPages: number;
	data: SmallCollectionPoint[];
};

// API lấy small collection có phân trang và filter (dùng bởi admin)
export const getSmallCollectionsFilter = async (
	params: SmallCollectionFilterParams
): Promise<PaginatedSmallCollection> => {
	const response = await axios.get('/small-collection/filter', { params });
	return response.data;
};

// API approve một điểm thu gom (dành cho role quản trị)
export const approveCollectionPoint = async (id: string | number): Promise<any> => {
	const response = await axios.patch(`/management/collection-points/${id}/approve`);
	return response.data;
};

// API block một điểm thu gom (dành cho role quản trị)
export const blockCollectionPoint = async (id: string | number): Promise<any> => {
	const response = await axios.patch(`/management/collection-points/${id}/block`);
	return response.data;
};
