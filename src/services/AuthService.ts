import axios from '@/lib/axios';

export const login = async (email: string) => {
    const response = await axios.post('/auth/login', { email });
    return response.data;
};