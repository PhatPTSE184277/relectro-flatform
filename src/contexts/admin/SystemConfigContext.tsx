'use client';

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  ReactNode
} from 'react';
import {
  getActiveSystemConfigs,
  getSystemConfigByKey,
  updateSystemConfig,
  SystemConfig,
  getAutoAssignSettings,
  updateAutoAssignSettings,
  AutoAssignSettings,
  updateWarehouseLoadThreshold,
  WarehouseLoadThresholdConfig
} from '@/services/admin/SystemConfigService';

interface SystemConfigContextType {
  configs: SystemConfig[];
  loading: boolean;
  error: string | null;
  fetchConfigs: (groupName?: string) => Promise<void>;
  fetchConfigByKey: (key: string) => Promise<SystemConfig | null>;
  updateConfig: (id: string, value?: string | null, file?: File | null) => Promise<SystemConfig | null>;
  autoAssignSettings: AutoAssignSettings | null;
  autoAssignLoading: boolean;
  fetchAutoAssignSettings: () => Promise<AutoAssignSettings | null>;
  saveAutoAssignSettings: (payload: AutoAssignSettings) => Promise<AutoAssignSettings | null>;
  saveWarehouseLoadThreshold: (smallCollectionPointId: string, threshold: number) => Promise<boolean>;
  getLoadThresholdConfigs: () => WarehouseLoadThresholdConfig[];
  clearConfigs: () => void;
}

const SystemConfigContext = createContext<SystemConfigContextType | undefined>(undefined);

type Props = { children: ReactNode };

export const SystemConfigProvider: React.FC<Props> = ({ children }) => {
  const [configs, setConfigs] = useState<SystemConfig[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [autoAssignSettings, setAutoAssignSettings] = useState<AutoAssignSettings | null>(null);
  const [autoAssignLoading, setAutoAssignLoading] = useState(false);

  const fetchConfigs = useCallback(async (groupName?: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getActiveSystemConfigs(groupName);
      setConfigs(data);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Lỗi khi tải cấu hình hệ thống');
      setConfigs([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchConfigByKey = useCallback(async (key: string) => {
    try {
      const config = await getSystemConfigByKey(key);
      return config;
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Không tìm thấy cấu hình');
      return null;
    }
  }, []);

  const updateConfig = useCallback(async (id: string, value?: string | null, file?: File | null) => {
    try {
      const updated = await updateSystemConfig(id, value, file);
      await fetchConfigs(); // Refresh configs after update
      return updated;
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Lỗi khi cập nhật cấu hình');
      return null;
    }
  }, [fetchConfigs]);

  const fetchAutoAssignSettings = useCallback(async () => {
    setAutoAssignLoading(true);
    setError(null);
    try {
      const data = await getAutoAssignSettings();
      setAutoAssignSettings(data);
      return data;
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Lỗi khi tải cấu hình tự động phân xe');
      setAutoAssignSettings(null);
      return null;
    } finally {
      setAutoAssignLoading(false);
    }
  }, []);

  const saveAutoAssignSettings = useCallback(async (payload: AutoAssignSettings) => {
    setAutoAssignLoading(true);
    setError(null);
    try {
      const updated = await updateAutoAssignSettings(payload);

      const looksLikeSettings = (value: any): value is AutoAssignSettings => {
        return (
          value &&
          typeof value === 'object' &&
          'isEnabled' in value &&
          'immediateThreshold' in value &&
          'scheduleTime' in value &&
          'scheduleMinQty' in value
        );
      };

      if (looksLikeSettings(updated)) {
        setAutoAssignSettings(updated);
        return updated;
      }

      const fresh = await getAutoAssignSettings();
      setAutoAssignSettings(fresh);
      return fresh;
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Lỗi khi cập nhật cấu hình tự động phân xe');
      return null;
    } finally {
      setAutoAssignLoading(false);
    }
  }, []);

  const clearConfigs = useCallback(() => {
    setConfigs([]);
    setError(null);
  }, []);

  const saveWarehouseLoadThreshold = useCallback(async (smallCollectionPointId: string, threshold: number) => {
    setLoading(true);
    setError(null);
    try {
      await updateWarehouseLoadThreshold({ smallCollectionPointId, threshold });
      await fetchConfigs();
      return true;
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Lỗi khi cập nhật ngưỡng tải đơn vị thu gom');
      return false;
    } finally {
      setLoading(false);
    }
  }, [fetchConfigs]);

  const getLoadThresholdConfigs = useCallback(() => {
    return configs.filter((cfg) => cfg.groupName === 'LoadThreshold') as WarehouseLoadThresholdConfig[];
  }, [configs]);

  useEffect(() => {
    void fetchConfigs();
  }, [fetchConfigs]);

  const value: SystemConfigContextType = {
    configs,
    loading,
    error,
    fetchConfigs,
    fetchConfigByKey,
    updateConfig,
    autoAssignSettings,
    autoAssignLoading,
    fetchAutoAssignSettings,
    saveAutoAssignSettings,
    saveWarehouseLoadThreshold,
    getLoadThresholdConfigs,
    clearConfigs
  };

  return (
    <SystemConfigContext.Provider value={value}>
      {children}
    </SystemConfigContext.Provider>
  );
};

export const useSystemConfigContext = (): SystemConfigContextType => {
  const ctx = useContext(SystemConfigContext);
  if (!ctx)
    throw new Error(
      'useSystemConfigContext must be used within SystemConfigProvider'
    );
  return ctx;
};
