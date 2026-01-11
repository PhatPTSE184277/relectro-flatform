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
  SystemConfig
} from '@/services/admin/SystemConfigService';

interface SystemConfigContextType {
  configs: SystemConfig[];
  loading: boolean;
  error: string | null;
  fetchConfigs: (groupName?: string) => Promise<void>;
  fetchConfigByKey: (key: string) => Promise<SystemConfig | null>;
  updateConfig: (id: string, value?: string | null, file?: File | null) => Promise<SystemConfig | null>;
  clearConfigs: () => void;
}

const SystemConfigContext = createContext<SystemConfigContextType | undefined>(undefined);

type Props = { children: ReactNode };

export const SystemConfigProvider: React.FC<Props> = ({ children }) => {
  const [configs, setConfigs] = useState<SystemConfig[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const clearConfigs = useCallback(() => {
    setConfigs([]);
    setError(null);
  }, []);

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
