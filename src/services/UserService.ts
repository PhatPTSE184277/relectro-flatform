import axios from '@/lib/axios';

export const getUserProfile = async () => {
    const response = await axios.get('/users/profile');
    return response.data;
};

export const getUserByPhone = async (phone: string): Promise<any> => {
	const response = await axios.get(`/users/phone/${phone}`);
	return response.data;
};