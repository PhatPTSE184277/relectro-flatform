"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { getFilteredShifts, getShiftDetail, importShiftsExcel, ShiftFilterParams } from '@/services/company/ShiftService';

interface ShiftContextType {
  loading: boolean;
  shifts: any[];
  selectedShift: any | null;
  error: string | null;
  fetchShifts: (params?: ShiftFilterParams) => Promise<void>;
  fetchShiftDetail: (id: string) => Promise<void>;
  importShifts: (file: File) => Promise<any>;
  clearShifts: () => void;
}

const ShiftContext = createContext<ShiftContextType | undefined>(undefined);

export const ShiftProvider = ({ children }: { children: ReactNode }) => {
  const [loading, setLoading] = useState(false);
  const [shifts, setShifts] = useState<any[]>([]);
  const [selectedShift, setSelectedShift] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchShifts = useCallback(async (params?: ShiftFilterParams) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getFilteredShifts(params || {});
      setShifts(data?.data || []);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Lỗi khi tải ca làm việc');
      setShifts([]);
    } finally {
      setLoading(false);
    }
  }, []);

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
  }, []);

  const value: ShiftContextType = {
    loading,
    shifts,
    selectedShift,
    error,
    fetchShifts,
    fetchShiftDetail,
    importShifts,
    clearShifts,
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
