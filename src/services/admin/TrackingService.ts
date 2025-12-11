import axios from '@/lib/axios';

// Lấy timeline tracking của sản phẩm theo productId
export const getProductTimeline = async (productId: string): Promise<any> => {
	const response = await axios.get(`/tracking/product/${productId}/timeline`);
	return response.data;
};
