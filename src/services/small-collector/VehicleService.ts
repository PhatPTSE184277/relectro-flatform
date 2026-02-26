import axios from '@/lib/axios';

export interface FilterVehiclesParams {
	page?: number;
	limit?: number;
	plateNumber?: string;
	collectionCompanyId?: string;
	smallCollectionPointId?: string;
	status?: string;
}

export interface VehicleItem {
	id?: number;
	vehicleId?: string;
	plateNumber?: string;
	vehicleType?: string;
	capacityKg?: number;
	capacityM3?: number;
	lengthM?: number;
	widthM?: number;
	heightM?: number;
	status?: string;
	smallCollectionPointId?: string;
	smallCollectionPointName?: string;
}

export interface VehicleListPagingResponse {
	page: number;
	limit: number;
	totalItems: number;
	totalPages: number;
	data: VehicleItem[];
}

// Lấy danh sách xe theo bộ lọc (matching Swagger screenshot)
export const filterVehicles = async (
	params: FilterVehiclesParams
): Promise<VehicleListPagingResponse> => {
	const response = await axios.get('/vehicle/filter', { params });
	return response.data;
};

// Lấy chi tiết xe theo vehicleId
export const getVehicleById = async (vehicleId: string): Promise<VehicleItem> => {
	const response = await axios.get(`/vehicle/${vehicleId}`);
	return response.data;
};

// Approve vehicle (management)
export const approveVehicle = async (id: string): Promise<any> => {
	const response = await axios.patch(`/management/vehicles/${id}/approve`);
	return response.data;
};

// Block vehicle (management)
export const blockVehicle = async (id: string): Promise<any> => {
	const response = await axios.patch(`/management/vehicles/${id}/block`);
	return response.data;
};
