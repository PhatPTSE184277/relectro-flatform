import axios from '@/lib/axios';

export interface VoucherPagedParams {
	page?: number;
	limit?: number;
	name?: string;
	status?: string;
}

export interface PagedResponse<T> {
	data: T[];
	totalItems: number;
	totalPages: number;
	page: number;
	limit: number;
}

export const getVouchersPaged = async (params?: VoucherPagedParams): Promise<PagedResponse<any>> => {
	const res = await axios.get<PagedResponse<any>>('/voucher/paged', { params });
	return res.data;
};

export const getVoucherById = async (id: string): Promise<any> => {
	const res = await axios.get(`/voucher/${id}`);
    return res.data;
};

export const createVoucher = async (payload: any): Promise<any> => {
	const res = await axios.post('/voucher', payload);
	return res.data;
};

export const importVouchersFromExcel = async (file: File): Promise<any> => {
	const formData = new FormData();
	formData.append('request', file);
	const res = await axios.post('/voucher/import-excel', formData, {
		headers: {
			'Content-Type': 'multipart/form-data'
		}
	});
	return res.data;
};