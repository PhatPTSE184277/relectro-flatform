import axios from '@/lib/axios';

export interface ShiftFilterParams {
  page?: number;
  limit?: number;
  fromDate?: string;
  toDate?: string;
  collectionCompanyId?: string;
  smallCollectionPointId?: string;
  status?: string;
}

// Lấy danh sách ca làm việc theo filter
export const getFilteredShifts = async (params: ShiftFilterParams): Promise<any> => {
  const response = await axios.get('/shift/filter', { params });
  return response.data;
};

// Lấy chi tiết ca làm việc theo id
export const getShiftDetail = async (id: string): Promise<any> => {
  const response = await axios.get(`/shift/${id}`);
  return response.data;
};

// Import ca làm việc từ file excel
export const importShiftsExcel = async (file: File): Promise<any> => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await axios.post('/shift/import-excel', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};