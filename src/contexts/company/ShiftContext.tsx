"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { getFilteredShifts, getShiftDetail, importShiftsExcel, ShiftFilterParams } from '@/services/company/ShiftService';

interface ShiftContextType {
  loading: boolean;
  shifts: any[];
  selectedShift: any | null;
  error: string | null;
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  fetchShifts: (params?: ShiftFilterParams) => Promise<void>;
  fetchShiftDetail: (id: string) => Promise<void>;
  importShifts: (file: File) => Promise<any>;
  clearShifts: () => void;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
}

const ShiftContext = createContext<ShiftContextType | undefined>(undefined);

export const ShiftProvider = ({ children }: { children: ReactNode }) => {
  const [loading, setLoading] = useState(false);
  const [shifts, setShifts] = useState<any[]>([]);
  const [selectedShift, setSelectedShift] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const fetchShifts = useCallback(async (params?: ShiftFilterParams) => {
    setLoading(true);
    setError(null);
    try {
      const mergedParams: ShiftFilterParams = {
        page: params?.page ?? page,
        limit: params?.limit ?? limit,
        ...params,
      };

      const data = await getFilteredShifts(mergedParams);
      setShifts(data?.data || []);
      setTotalItems(data?.totalItems ?? 0);
      setTotalPages(data?.totalPages ?? 1);
      setPage(data?.page ?? mergedParams.page ?? 1);
      setLimit(data?.limit ?? mergedParams.limit ?? 10);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Lỗi khi tải ca làm việc');
      setShifts([]);
      setTotalItems(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [page, limit]);

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

  const clearShifts = useCallback(() => {
    setShifts([]);
    setSelectedShift(null);
    setError(null);
    setPage(1);
    setTotalItems(0);
    setTotalPages(1);
  }, []);

  const value: ShiftContextType = {
    loading,
    shifts,
    selectedShift,
    error,
    page,
    limit,
    totalItems,
    totalPages,
    fetchShifts,
    fetchShiftDetail,
    importShifts,
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
