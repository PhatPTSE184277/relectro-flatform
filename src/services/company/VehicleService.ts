import axios from '@/lib/axios';

export interface VehicleFilterParams {
  page?: number;
  limit?: number;
  PlateNumber?: string; // search by plate number
  collectionCompanyId?: string;
  smallCollectionPointId?: string;
  status?: string;
}

// Lấy danh sách phương tiện theo filter
export const getFilteredVehicles = async (params: VehicleFilterParams): Promise<any> => {
  const response = await axios.get('/vehicle/filter', { params });
  return response.data;
};

// Lấy chi tiết phương tiện theo id
export const getVehicleById = async (id: string): Promise<any> => {
  const response = await axios.get(`/vehicle/${id}`);
  return response.data;
};
