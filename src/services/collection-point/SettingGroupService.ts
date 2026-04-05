import axios from '@/lib/axios';

// Lấy thông tin group setting của công ty theo companyId
export const getCompanySettingGroup = async (companyId: string): Promise<any> => {
	const response = await axios.get(`/grouping/company/settings/${companyId}`);
	return response.data;
};

// Lấy thông tin group setting của điểm theo pointId
export const getPointSettingGroup = async (pointId: string): Promise<any> => {
	const response = await axios.get(`/grouping/settings/${pointId}`);
	return response.data;
};

// Tạo/cập nhật group setting cho điểm
export const createPointSettingGroup = async (data: {
	pointId: string;
	serviceTimeMinutes: number;
	avgTravelTimeMinutes: number;
}): Promise<any> => {
	const response = await axios.post('/grouping/settings', data);
	return response.data;
};
