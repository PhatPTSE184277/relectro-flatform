import axios from '@/lib/axios';

export const getUserProfile = async () => {
    const response = await axios.get('/users/profile');
    return response.data;
};

export const getUserByInformation = async (information: string): Promise<any> => {
	const response = await axios.get(`/users/infomation/${information}`);
	return response.data;
};