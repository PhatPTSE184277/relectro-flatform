"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { getFilteredVehicles, getVehicleById, importVehiclesExcel, VehicleFilterParams } from '@/services/company/VehicleService';

interface VehicleContextType {
  loading: boolean;
  vehicles: any[];
  selectedVehicle: any | null;
  error: string | null;
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

  const fetchVehicles = useCallback(async (params?: VehicleFilterParams) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getFilteredVehicles(params || {});
      setVehicles(data?.data || []);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Lỗi khi tải phương tiện');
      setVehicles([]);
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
  }, []);

  const value: VehicleContextType = {
    loading,
    vehicles,
    selectedVehicle,
    error,
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