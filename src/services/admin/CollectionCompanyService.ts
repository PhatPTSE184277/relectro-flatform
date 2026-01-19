
import axios from '@/lib/axios';

export type CollectionCompany = {
	id: string;
	name: string;
	companyEmail: string;
	phone: string;
	city: string;
	status: string;
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
