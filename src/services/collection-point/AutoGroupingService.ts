import axios from '@/lib/axios';

export interface AutoGroupingSettings {
  collectionUnitId: string;
  isEnabled: boolean;
  scheduleTime: string;
  loadThresholdPercent: number;
}

const normalize = (data: any): AutoGroupingSettings => ({
  collectionUnitId: String(data?.collectionUnitId ?? data?.collectionUnitID ?? data?.smallCollectionPointId ?? ''),
  isEnabled: Boolean(data?.isEnabled ?? false),
  scheduleTime: String(data?.scheduleTime ?? '00:00'),
  loadThresholdPercent: Number(data?.loadThresholdPercent ?? data?.thresholdPercent ?? 0),
});

export const getAutoGroupingSettings = async (collectionUnitId: string): Promise<AutoGroupingSettings> => {
  const response = await axios.get(`/system-config/auto-grouping/${collectionUnitId}`);
  return normalize(response.data?.data ?? response.data);
};

export const updateAutoGroupingSettings = async (payload: AutoGroupingSettings): Promise<AutoGroupingSettings> => {
  const response = await axios.put('/system-config/auto-grouping', payload);
  return normalize(response.data?.data ?? response.data);
};
