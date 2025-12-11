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
export const updateSystemConfig = async (id: string, value: string): Promise<SystemConfig> => {
  const response = await axios.put(`/system-config/${id}`, {
    value,
  });
  return response.data;
};
