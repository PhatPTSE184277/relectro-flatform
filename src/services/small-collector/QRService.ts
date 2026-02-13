import axios from '@/lib/axios';

export const verifyQR = async (qrCode: string): Promise<any> => {
	const response = await axios.post(`/QR/Verify/${qrCode}`);
	return response.data;
};

export default verifyQR;

