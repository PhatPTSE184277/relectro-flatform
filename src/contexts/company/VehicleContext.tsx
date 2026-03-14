"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { getFilteredVehicles, getVehicleById, importVehiclesExcel, VehicleFilterParams } from '@/services/company/VehicleService';

interface VehicleContextType {
  loading: boolean;
  vehicles: any[];
  selectedVehicle: any | null;
  error: string | null;
  page: number;
  limit: number;
  total: number;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  fetchVehicles: (params?: VehicleFilterParams) => Promise<void>;
  fetchVehicleDetail: (id: string) => Promise<void>;
  importVehicles: (file: File) => Promise<any>;
  clearVehicles: () => void;
}

const VehicleContext = createContext<VehicleContextType | undefined>(undefined);

export const VehicleProvider = ({ children }: { children: ReactNode }) => {
  const [loading, setLoading] = useState(false);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);

  const fetchVehicles = useCallback(async (params?: VehicleFilterParams) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getFilteredVehicles(params || {});
      if (Array.isArray(data)) {
        setVehicles(data);
        setTotal(data.length);
      } else {
        setVehicles(data?.data || []);
        setTotal(data?.totalItems ?? data?.total ?? 0);
      }
    } catch (err: any) {
      console.log(err);
      setError(err?.response?.data?.message || 'Lỗi khi tải phương tiện');
      setVehicles([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchVehicleDetail = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getVehicleById(id);
      setSelectedVehicle(data);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Lỗi khi tải chi tiết phương tiện');
      setSelectedVehicle(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const importVehicles = useCallback(async (file: File) => {
    setLoading(true);
    setError(null);
    try {
      const result = await importVehiclesExcel(file);
      return result;
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Lỗi khi import phương tiện');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);
    
  const clearVehicles = useCallback(() => {
    setVehicles([]);
    setSelectedVehicle(null);
    setError(null);
    setTotal(0);
  }, []);

  const value: VehicleContextType = {
    loading,
    vehicles,
    selectedVehicle,
    error,
    page,
    limit,
    total,
    setPage,
    setLimit,
    fetchVehicles,
    fetchVehicleDetail,
    importVehicles,
    clearVehicles,
  };

  return (
    <VehicleContext.Provider value={value}>
      {children}
    </VehicleContext.Provider>
  );
};

export const useVehicleContext = () => {
  const context = useContext(VehicleContext);
  if (!context) throw new Error('useVehicleContext must be used within VehicleProvider');
  return context;
};