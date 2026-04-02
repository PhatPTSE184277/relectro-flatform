import axios from '@/lib/axios';

export interface OffDate {
  year: number;
  month: number;
  day: number;
  dayOfWeek?: number;
}

export interface RegisterOffDayPayload {
  companyId: string;
  smallCollectionPointIds: string[];
  /**
   * Swagger expects array of date strings (yyyy-mm-dd)
   * Example: ["2026-04-17", "2026-04-18"]
   */
  offDates: string[];
  reason?: string;
}

// Register off-days
export const registerCollectionOffDay = async (payload: RegisterOffDayPayload): Promise<any> => {
  const response = await axios.post('/CollectionOffDay/register', payload);
  return response.data;
};

// Cancel off-day (DELETE endpoint)
export const cancelCollectionOffDay = async (params: { companyId?: string; pointId?: string; date?: string }): Promise<any> => {
  const response = await axios.delete('/CollectionOffDay/cancel', { params });
  return response.data;
};

// Get all off-days (paginated)
export const getAllCollectionOffDays = async (
  params: { companyId?: string; date?: string; smallCollectionPointId?: string; page?: number; limit?: number }
): Promise<any> => {
  const response = await axios.get('/CollectionOffDay/all-off-days', { params });
  return response.data;
};

