import axios from '@/lib/axios';

export interface SystemConfig {
  systemConfigId: string;
  key: string;
  value: string;
  displayName: string;
  groupName: string;
  [key: string]: any;
}

export const getActiveSystemConfigs = async (): Promise<SystemConfig[]> => {
  const response = await axios.get('/system-config/active');
  return response.data;
};
    
export const getSystemConfigByKey = async (key: string): Promise<SystemConfig> => {
  const response = await axios.get(`/system-config/${key}`);
  return response.data;
};

// Cập nhật giá trị system config theo id
export const updateSystemConfig = async (
  id: string, 
  value?: string | null,
  file?: File | null
): Promise<SystemConfig> => {
  const formData = new FormData();
  
  if (file) {
    formData.append('ExcelFile', file);
    formData.append('Value', '');
  } else if (value !== null && value !== undefined) {
    formData.append('Value', value);
  }
  
  const response = await axios.put(`/system-config/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};
