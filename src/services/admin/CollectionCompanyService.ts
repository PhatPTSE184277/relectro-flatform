
import axios from '@/lib/axios';

export type CollectionCompany = {
	id: number;
	name: string;
	companyEmail: string;
	phone: string;
	city: string;
	status: string;
};

export const getCollectionCompanies = async (): Promise<CollectionCompany[]> => {
	const response = await axios.get('/collection-company');
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
