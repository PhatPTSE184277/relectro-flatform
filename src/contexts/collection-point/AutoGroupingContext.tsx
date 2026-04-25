'use client';

import React, { createContext, useCallback, useContext, useEffect, useState, ReactNode } from 'react';
import {
  AutoGroupingSettings,
  getAutoGroupingSettings,
  updateAutoGroupingSettings,
} from '@/services/collection-point/AutoGroupingService';
import { useAuth } from '@/hooks/useAuth';

interface AutoGroupingContextType {
  settings: AutoGroupingSettings | null;
  loading: boolean;
  saving: boolean;
  error: string | null;
  fetchSettings: () => Promise<AutoGroupingSettings | null>;
  saveSettings: (payload: AutoGroupingSettings) => Promise<AutoGroupingSettings | null>;
}

const AutoGroupingContext = createContext<AutoGroupingContextType | undefined>(undefined);

export const AutoGroupingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const collectionUnitId = String(user?.smallCollectionPointId || '');

  const [settings, setSettings] = useState<AutoGroupingSettings | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = useCallback(async () => {
    if (!collectionUnitId) return null;
    setLoading(true);
    setError(null);
    try {
      const data = await getAutoGroupingSettings(collectionUnitId);
      setSettings(data);
      return data;
    } catch (err: any) {
      setSettings(null);
      setError(err?.response?.data?.message || 'Không tải được cấu hình tự động phân xe');
      return null;
    } finally {
      setLoading(false);
    }
  }, [collectionUnitId]);

  const saveSettings = useCallback(async (payload: AutoGroupingSettings) => {
    if (!collectionUnitId) return null;
    setSaving(true);
    setError(null);
    try {
      await updateAutoGroupingSettings({ ...payload, collectionUnitId });
      return await fetchSettings();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Không lưu được cấu hình tự động phân xe');
      return null;
    } finally {
      setSaving(false);
    }
  }, [collectionUnitId, fetchSettings]);

  useEffect(() => {
    void fetchSettings();
  }, [fetchSettings]);

  return (
    <AutoGroupingContext.Provider value={{ settings, loading, saving, error, fetchSettings, saveSettings }}>
      {children}
    </AutoGroupingContext.Provider>
  );
};

export const useAutoGroupingContext = (): AutoGroupingContextType => {
  const ctx = useContext(AutoGroupingContext);
  if (!ctx) throw new Error('useAutoGroupingContext must be used within AutoGroupingProvider');
  return ctx;
};
