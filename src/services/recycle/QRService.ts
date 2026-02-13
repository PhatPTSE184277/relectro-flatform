import axios from '@/lib/axios';

export const generateQRForCompany = async (companyId: string): Promise<any> => {
	const response = await axios.get(`/QR/Generate/${companyId}`);
	return response.data;
};
