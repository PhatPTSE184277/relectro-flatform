
import axios from '@/lib/axios';
import { SmallCollectionPoint } from '@/types';

export type Company = {
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

export type CompanyDetail = Company & {
	warehouses: Warehouse[];
};

export type PaginatedCompany = {
	page: number;
	limit: number;
	totalItems: number;
	totalPages: number;
	data: Company[];
};

// API lấy tất cả công ty (không phân trang) - dùng cho dropdown/select
export const getCompanies = async (): Promise<Company[]> => {
	const response = await axios.get('/company');
	if (response.data.data && Array.isArray(response.data.data)) {
		return response.data.data;
	}
	return Array.isArray(response.data) ? response.data : [];
};

// API lấy công ty có phân trang và filter
export const getCompaniesFilter = async (
	page = 1,
	limit = 10,
	type?: string,
	status?: string
): Promise<PaginatedCompany> => {
	const params: any = { page, limit };
	if (type) params.type = type;
	if (status) params.status = status;
	const response = await axios.get('/company/filter', { params });
	return response.data;
};

export const getCompanyById = async (companyId: string): Promise<Company> => {
	const response = await axios.get(`/company/${companyId}`);
	return response.data;
};

export const importCompaniesFromExcel = async (file: File): Promise<any> => {
	const formData = new FormData();
	formData.append('file', file);
	const response = await axios.post('/company/import-excel', formData, {
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

// Backwards-compatible aliases (do not remove immediately)
export type CollectionCompany = Company;
export type CollectionCompanyDetail = CompanyDetail;
export type PaginatedCollectionCompany = PaginatedCompany;
export const getCollectionCompanies = getCompanies;
export const getCollectionCompaniesFilter = getCompaniesFilter;
export const getCollectionCompanyById = getCompanyById;
export const importCollectionCompaniesFromExcel = importCompaniesFromExcel;
