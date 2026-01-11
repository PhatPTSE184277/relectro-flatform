'use client';
import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { getSCPStats, getSCPStatsByDay, getPackageStats, SCPStatsResponse, PackageStatsResponse } from '@/services/small-collector/DashboardService';
import { useAuth } from '@/hooks/useAuth';

interface DashboardContextType {
  summary: SCPStatsResponse | null;
  loading: boolean;
  fetchSummary: (fromDate: string, toDate: string) => Promise<void>;
  fetchSummaryByDay: (date: string) => Promise<void>;
  fetchPackageStats: (fromDate: string, toDate: string) => Promise<PackageStatsResponse | null>;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export const DashboardProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth(); // Get user from auth context
  const [summary, setSummary] = useState<SCPStatsResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchSummary = useCallback(async (fromDate: string, toDate: string) => {
    if (!user?.smallCollectionPointId) {
      console.warn('No smallCollectionPointId found in user profile');
      return;
    }
    setLoading(true);
    try {
      const res = await getSCPStats(user.smallCollectionPointId, fromDate, toDate);
      setSummary(res);
    } catch (err) {
      console.log(err);
      setSummary(null);
    } finally {
      setLoading(false);
    }
  }, [user?.smallCollectionPointId]);

  const fetchSummaryByDay = useCallback(async (date: string) => {
    if (!user?.smallCollectionPointId) {
      console.warn('No smallCollectionPointId found in user profile');
      return;
    }
    setLoading(true);
    try {
      const res = await getSCPStatsByDay(user.smallCollectionPointId, date);
      setSummary(res);
    } catch (err) {
      console.log(err);
      setSummary(null);
    } finally {
      setLoading(false);
    }
  }, [user?.smallCollectionPointId]);

  const fetchPackageStats = useCallback(async (fromDate: string, toDate: string) => {
    if (!user?.smallCollectionPointId) {
      console.warn('No smallCollectionPointId found in user profile');
      return null;
    }
    setLoading(true);
    try {
      const res = await getPackageStats(user.smallCollectionPointId, fromDate, toDate);
      return res;
    } catch (err) {
      console.log(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [user?.smallCollectionPointId]);

  const value: DashboardContextType = {
    summary,
    loading,
    fetchSummary,
    fetchSummaryByDay,
    fetchPackageStats,
  };

  return <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>;
};

export const useDashboardContext = (): DashboardContextType => {
  const ctx = useContext(DashboardContext);
  if (!ctx) throw new Error('useDashboardContext must be used within DashboardProvider');
  return ctx;
};