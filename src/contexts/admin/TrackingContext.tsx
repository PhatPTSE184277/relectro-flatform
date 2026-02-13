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
  filterCollectionCompanies,
  filterPackages,
  getPackageDetail
} from '@/services/admin/TrackingService';


interface TrackingContextType {
  companies: any[];
  packages: any[];
  packageDetail: any | null;
  loadingCompanies: boolean;
  loadingPackages: boolean;
  loadingPackageDetail: boolean;
  error: string | null;
  fetchCompanies: () => Promise<void>;
  fetchPackages: (companyId: string, fromDate?: string, toDate?: string, status?: string) => Promise<void>;
  fetchPackageDetail: (packageId: string, page?: number, limit?: number) => Promise<void>;
  clearCompanies: () => void;
  clearPackages: () => void;
  clearPackageDetail: () => void;
}


const TrackingContext = createContext<TrackingContextType | undefined>(undefined);


type Props = { children: ReactNode };

export const TrackingProvider: React.FC<Props> = ({ children }) => {
  const [companies, setCompanies] = useState<any[]>([]);
  const [packages, setPackages] = useState<any[]>([]);
  const [packageDetail, setPackageDetail] = useState<any | null>(null);
  const [loadingCompanies, setLoadingCompanies] = useState(false);
  const [loadingPackages, setLoadingPackages] = useState(false);
  const [loadingPackageDetail, setLoadingPackageDetail] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCompanies = useCallback(async () => {
    setLoadingCompanies(true);
    setError(null);
    try {
      const data = await filterCollectionCompanies({ page: 1, limit: 10 });
      console.log(data)
      setCompanies(Array.isArray(data) ? data : (data.data || []));
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Lỗi khi tải danh sách công ty');
      setCompanies([]);
    } finally {
      setLoadingCompanies(false);
    }
  }, []);

  const fetchPackages = useCallback(async (companyId: string, fromDate?: string, toDate?: string, status?: string) => {
    setLoadingPackages(true);
    setError(null);
    try {
      const params: any = { page: 1, limit: 10, companyId };
      if (fromDate) params.fromDate = fromDate;
      if (toDate) params.toDate = toDate;
      if (status && status !== 'all') params.status = status;
      const data = await filterPackages(params);
      setPackages(Array.isArray(data) ? data : (data.data || []));
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Lỗi khi tải danh sách package');
      setPackages([]);
    } finally {
      setLoadingPackages(false);
    }
  }, []);

  const fetchPackageDetail = useCallback(async (packageId: string, page = 1, limit = 10) => {
    setLoadingPackageDetail(true);
    setError(null);
    try {
      const data = await getPackageDetail(packageId, page, limit);
      setPackageDetail(data || null);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Lỗi khi tải chi tiết package');
      setPackageDetail(null);
    } finally {
      setLoadingPackageDetail(false);
    }
  }, []);

  const clearCompanies = useCallback(() => {
    setCompanies([]);
    setError(null);
  }, []);
  const clearPackages = useCallback(() => {
    setPackages([]);
    setError(null);
  }, []);
  const clearPackageDetail = useCallback(() => {
    setPackageDetail(null);
    setError(null);
  }, []);

  useEffect(() => {
    void fetchCompanies();
  }, [fetchCompanies]);

  const value: TrackingContextType = {
    companies,
    packages,
    packageDetail,
    loadingCompanies,
    loadingPackages,
    loadingPackageDetail,
    error,
    fetchCompanies,
    fetchPackages,
    fetchPackageDetail,
    clearCompanies,
    clearPackages,
    clearPackageDetail
  };

  return (
    <TrackingContext.Provider value={value}>
      {children}
    </TrackingContext.Provider>
  );
};


export const useTrackingContext = (): TrackingContextType => {
  const ctx = useContext(TrackingContext);
  if (!ctx)
    throw new Error('useTrackingContext must be used within TrackingProvider');
  return ctx;
};
