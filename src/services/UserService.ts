import axios from '@/lib/axios';

export const getUserByPhone = async (phone: string): Promise<any> => {
	const response = await axios.get(`/users/phone/${phone}`);
	return response.data;
};
