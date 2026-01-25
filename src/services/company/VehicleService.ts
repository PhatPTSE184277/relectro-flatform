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
  const mappedParams = { ...params };
  if (mappedParams.status === 'active') {
    mappedParams.status = 'Đang hoạt động';
  } else if (mappedParams.status === 'inactive') {
    mappedParams.status = 'Ngừng hoạt động';
  }
  const response = await axios.get('/vehicle/filter', { params: mappedParams });
  return response.data;
};

// Lấy chi tiết phương tiện theo id
export const getVehicleById = async (id: string): Promise<any> => {
  const response = await axios.get(`/vehicle/${id}`);
  return response.data;
};

// Import phương tiện từ file Excel
export const importVehiclesExcel = async (file: File): Promise<any> => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await axios.post('/vehicle/import-excel', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};
