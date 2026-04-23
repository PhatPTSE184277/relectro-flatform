"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { getFilteredShifts, getShiftDetail, importShiftsExcel, activateShift as activateShiftApi, deactivateShift as deactivateShiftApi, ShiftFilterParams } from '@/services/collection-point/ShiftService';
import { useAuth } from '@/hooks/useAuth';

interface ShiftContextType {
  loading: boolean;
  actionLoading: boolean;
  shifts: any[];
  selectedShift: any | null;
  error: string | null;
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  stats: {
    total: number;
    active: number;
    scheduled: number;
    cancelled: number;
  };
  fetchShifts: (params?: ShiftFilterParams) => Promise<void>;
  fetchShiftDetail: (id: string) => Promise<void>;
  importShifts: (file: File) => Promise<any>;
  activateShift: (shiftId: string) => Promise<void>;
  deactivateShift: (shiftId: string) => Promise<void>;
  clearShifts: () => void;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
}

const ShiftContext = createContext<ShiftContextType | undefined>(undefined);

export const ShiftProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [shifts, setShifts] = useState<any[]>([]);
  const [selectedShift, setSelectedShift] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({ total: 0, active: 0, scheduled: 0, cancelled: 0 });

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const currentParamsRef = React.useRef<ShiftFilterParams>({ page: 1, limit: 10 });

  const fetchShiftStats = useCallback(async (params: Omit<ShiftFilterParams, 'page' | 'limit'>) => {
    try {
      const [allRes, activeRes, scheduledRes, cancelledRes] = await Promise.all([
        getFilteredShifts({ ...params, page: 1, limit: 1 }),
        getFilteredShifts({ ...params, status: 'Có sẵn', page: 1, limit: 1 }),
        getFilteredShifts({ ...params, status: 'Đã lên lịch', page: 1, limit: 1 }),
        getFilteredShifts({ ...params, status: 'Đã hủy', page: 1, limit: 1 }),
      ]);

      setStats({
        total: allRes?.totalItems || 0,
        active: activeRes?.totalItems || 0,
        scheduled: scheduledRes?.totalItems || 0,
        cancelled: cancelledRes?.totalItems || 0,
      });
    } catch {
      // ignore stats errors
    }
  }, []);

  const fetchShifts = useCallback(async (params?: ShiftFilterParams) => {
    setLoading(true);
    setError(null);
    try {
      const mergedParams: ShiftFilterParams = {
        page: params?.page ?? page,
        limit: params?.limit ?? limit,
        ...params,
      };
      currentParamsRef.current = mergedParams;

      const data = await getFilteredShifts(mergedParams);
      setShifts(data?.data || []);
      setTotalItems(data?.totalItems ?? 0);
      setTotalPages(data?.totalPages ?? 1);
      setPage(data?.page ?? mergedParams.page ?? 1);
      setLimit(data?.limit ?? mergedParams.limit ?? 10);

      // Refresh stats on first page or when params change
      if ((mergedParams.page ?? 1) === 1 && user?.collectionCompanyId) {
        const { page: _, limit: __, ...statsParams } = mergedParams;
        void fetchShiftStats(statsParams);
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Lỗi khi tải ca làm việc');
      setShifts([]);
      setTotalItems(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [page, limit, fetchShiftStats, user?.collectionCompanyId]);

  const fetchShiftDetail = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getShiftDetail(id);
      setSelectedShift(data);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Lỗi khi tải chi tiết ca làm việc');
      setSelectedShift(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const importShifts = useCallback(async (file: File) => {
    setLoading(true);
    setError(null);
    try {
      const result = await importShiftsExcel(file);
      return result;
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Lỗi khi import ca làm việc');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const activateShift = useCallback(async (shiftId: string) => {
    setActionLoading(true);
    setError(null);
    try {
      await activateShiftApi(shiftId);
      await fetchShifts(currentParamsRef.current);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Lỗi khi khóa ca làm việc');
      throw err;
    } finally {
      setActionLoading(false);
    }
  }, [fetchShifts]);

  const deactivateShift = useCallback(async (shiftId: string) => {
    setActionLoading(true);
    setError(null);
    try {
      await deactivateShiftApi(shiftId);
      await fetchShifts(currentParamsRef.current);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Lỗi khi mở khóa ca làm việc');
      throw err;
    } finally {
      setActionLoading(false);
    }
  }, [fetchShifts]);

  const clearShifts = useCallback(() => {
    setShifts([]);
    setSelectedShift(null);
    setError(null);
    setPage(1);
    setTotalItems(0);
    setTotalPages(1);
    setStats({ total: 0, active: 0, scheduled: 0, cancelled: 0 });
  }, []);

  const value: ShiftContextType = {
    loading,
    actionLoading,
    shifts,
    selectedShift,
    error,
    page,
    limit,
    totalItems,
    totalPages,
    stats,
    fetchShifts,
    fetchShiftDetail,
    importShifts,
    activateShift,
    deactivateShift,
    clearShifts,
    setPage,
    setLimit,
  };

  return (
    <ShiftContext.Provider value={value}>
      {children}
    </ShiftContext.Provider>
  );
};

export const useShiftContext = () => {
  const context = useContext(ShiftContext);
  if (!context) throw new Error('useShiftContext must be used within ShiftProvider');
  return context;
};
