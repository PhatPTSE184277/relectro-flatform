import axios from '@/lib/axios';
import { AssignedProduct, AssignProductsRequest } from '@/types/AssignProduct';

export const assignProducts = async (data: AssignProductsRequest): Promise<any> => {
	const response = await axios.post('/assign/products', data);
	return response.data;
};

export const getAssignedProductsByDate = async (workDate: string): Promise<AssignedProduct[]> => {
	const response = await axios.get<AssignedProduct[]>('/assign/products-by-date', {
		params: { workDate },
	});
	return response.data;
};

export const getUnassignedProducts = async (workDate: string): Promise<any[]> => {
	const response = await axios.get<any[]>('/assign/products-by-date', {
		params: { workDate },
	});
	return response.data;
};
