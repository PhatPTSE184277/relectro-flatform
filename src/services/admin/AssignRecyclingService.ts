import axios from '@/lib/axios';

export const getRecyclingCompanies = async (): Promise<any> => {
	const response = await axios.get('/RecyclingAssign/recycling-companies');
	return response.data;
};

export const assignSmallCollectionPoints = async (data: {
	recyclingCompanyId: string;
	smallCollectionPointIds: string[];
}): Promise<any> => {
	const response = await axios.post('/RecyclingAssign/assign-scp', data);
	return response.data;
};

export const updateSmallCollectionPointAssignment = async (
	scpId: string,
	data: { newRecyclingCompanyId: string }
): Promise<any> => {
	const response = await axios.put(`/RecyclingAssign/scp/${scpId}/assign`, data);
	return response.data;
};

export const listSmallCollectionPoints = async (): Promise<any> => {
	const response = await axios.get('/RecyclingAssign/list-scp');
	return response.data;
};

export const getRecyclingTasks = async (recyclingCompanyId: string): Promise<any> => {
	const response = await axios.get('/RecyclingQuery/tasks', {
		params: { recyclingCompanyId },
	});
	return response.data;
};