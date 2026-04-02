import axios from '@/lib/axios';

export interface SystemConfig {
  systemConfigId: string;
  key: string;
  value: string;
  displayName: string;
  groupName: string;
  [key: string]: any;
}

export interface AutoAssignSettings {
  isEnabled: boolean;
  immediateThreshold: number;
  scheduleTime: string;
  scheduleMinQty: number;
}

export interface WarehouseLoadThresholdConfig extends SystemConfig {
  companyName?: string;
  scpName?: string;
  status?: string;
  smallCollectionPointId?: string;
  scpId?: string;
}

export interface UpdateWarehouseLoadThresholdPayload {
  smallCollectionPointId: string;
  threshold: number;
}


export const getActiveSystemConfigs = async (groupName?: string): Promise<SystemConfig[]> => {
  const response = await axios.get('/system-config/active', {
    params: groupName ? { GroupName: groupName } : undefined,
  });
  return response.data;
};
export const getSystemConfigByKey = async (key: string): Promise<SystemConfig> => {
  const response = await axios.get(`/system-config/${key}`);
  return response.data;
};

export const updateWarehouseLoadThreshold = async (
  payload: UpdateWarehouseLoadThresholdPayload
): Promise<any> => {
  const response = await axios.put('/system-config/warehouse-load-threshold', payload);
  return response.data;
};

export const getAutoAssignSettings = async (): Promise<AutoAssignSettings> => {
  const response = await axios.get('/system-config/auto-assign-settings');
  // API may return either { success, data } or just the data.
  return (response.data?.data ?? response.data) as AutoAssignSettings;
};

export const updateAutoAssignSettings = async (
  payload: AutoAssignSettings
): Promise<AutoAssignSettings> => {
  const response = await axios.put('/system-config/auto-assign-settings', payload);
  return (response.data?.data ?? response.data) as AutoAssignSettings;
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
