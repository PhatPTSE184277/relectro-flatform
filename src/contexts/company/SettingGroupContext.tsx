'use client';

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode
} from 'react';
import {
  getCompanySettingGroup,
  getPointSettingGroup,
  createPointSettingGroup
} from '@/services/company/SettingGroupService';

interface SettingGroupContextType {
  companySetting: any;
  pointSetting: any;
  loading: boolean;
  error: string | null;
  fetchCompanySetting: (companyId: string) => Promise<void>;
  fetchPointSetting: (pointId: string) => Promise<void>;
  createOrUpdatePointSetting: (data: {
    pointId: string;
    serviceTimeMinutes: number;
    avgTravelTimeMinutes: number;
  }) => Promise<void>;
  clear: () => void;
}

const SettingGroupContext = createContext<SettingGroupContextType | undefined>(undefined);

export const SettingGroupProvider = ({ children }: { children: ReactNode }) => {
  const [companySetting, setCompanySetting] = useState<any>(null);
  const [pointSetting, setPointSetting] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCompanySetting = useCallback(async (companyId: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getCompanySettingGroup(companyId);
      setCompanySetting(data);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Lỗi khi tải cấu hình công ty');
      setCompanySetting(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchPointSetting = useCallback(async (pointId: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getPointSettingGroup(pointId);
      setPointSetting(data);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Lỗi khi tải cấu hình điểm');
      setPointSetting(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const createOrUpdatePointSetting = useCallback(async (data: {
    pointId: string;
    serviceTimeMinutes: number;
    avgTravelTimeMinutes: number;
  }) => {
    setLoading(true);
    setError(null);
    try {
      await createPointSettingGroup(data);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Lỗi khi lưu cấu hình điểm');
    } finally {
      setLoading(false);
    }
  }, []);

  const clear = useCallback(() => {
    setCompanySetting(null);
    setPointSetting(null);
    setError(null);
  }, []);

  return (
    <SettingGroupContext.Provider
      value={{
        companySetting,
        pointSetting,
        loading,
        error,
        fetchCompanySetting,
        fetchPointSetting,
        createOrUpdatePointSetting,
        clear
      }}
    >
      {children}
    </SettingGroupContext.Provider>
  );
};

export const useSettingGroupContext = () => {
  const context = useContext(SettingGroupContext);
  if (!context) throw new Error('useSettingGroupContext must be used within SettingGroupProvider');
  return context;
};
