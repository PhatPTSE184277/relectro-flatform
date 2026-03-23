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
  filterSmallCollectionPoints,
  filterPackages,
  getPackageDetail,
  PackageFilterParams
} from '@/services/admin/TrackingService';
import { getFirstDayOfMonthString, getTodayString } from '@/utils/getDayString';

interface TrackingStats {
  packing: number;
  closed: number;
  shipping: number;
  recycled: number;
}

interface TrackingFilterParams extends PackageFilterParams {
  page: number;
  limit: number;
  status: string;
  fromDate: string;
  toDate: string;
  companyId?: string;
  packageId?: string;
}

interface TrackingContextType {
  companies: any[];
  warehouses: any[];
  packages: any[];
  packageDetail: any | null;
  totalPages: number;
  totalItems: number;
  stats: TrackingStats;
  filter: TrackingFilterParams;
  loadingCompanies: boolean;
  loadingWarehouses: boolean;
  loadingPackages: boolean;
  loadingPackageDetail: boolean;
  error: string | null;
  fetchCompanies: () => Promise<void>;
  setFilter: (next: Partial<TrackingFilterParams>) => void;
  fetchPackages: (customFilter?: Partial<TrackingFilterParams>) => Promise<void>;
  fetchPackageDetail: (packageId: string, page?: number, limit?: number) => Promise<void>;
  clearPackageDetail: () => void;
}


const TrackingContext = createContext<TrackingContextType | undefined>(undefined);


type Props = { children: ReactNode };

export const TrackingProvider: React.FC<Props> = ({ children }) => {
  const [companies, setCompanies] = useState<any[]>([]);
  const [warehouses, setWarehouses] = useState<any[]>([]);
  const [packages, setPackages] = useState<any[]>([]);
  const [packageDetail, setPackageDetail] = useState<any | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [stats, setStats] = useState<TrackingStats>({
    packing: 0,
    closed: 0,
    shipping: 0,
    recycled: 0
  });
  const [loadingCompanies, setLoadingCompanies] = useState(false);
  const [loadingWarehouses, setLoadingWarehouses] = useState(false);
  const [loadingPackages, setLoadingPackages] = useState(false);
  const [loadingPackageDetail, setLoadingPackageDetail] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [filter, setFilterState] = useState<TrackingFilterParams>({
    page: 1,
    limit: 10,
    status: 'Đang vận chuyển',
    fromDate: getFirstDayOfMonthString(),
    toDate: getTodayString(),
    companyId: undefined,
    smallCollectionPointId: undefined,
    packageId: ''
  });

  const fetchCompanies = useCallback(async () => {
    setLoadingCompanies(true);
    setError(null);
    try {
      const data = await filterCollectionCompanies({ page: 1, limit: 10 });
      setCompanies(Array.isArray(data) ? data : (data.data || []));
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Lỗi khi tải danh sách công ty');
      setCompanies([]);
    } finally {
      setLoadingCompanies(false);
    }
  }, []);

  const fetchWarehouses = useCallback(async (companyId?: string) => {
    if (!companyId) {
      setWarehouses([]);
      return;
    }

    setLoadingWarehouses(true);
    try {
      const data = await filterSmallCollectionPoints({ page: 1, limit: 100, companyId });
      setWarehouses(Array.isArray(data) ? data : (data.data || []));
    } catch {
      setWarehouses([]);
    } finally {
      setLoadingWarehouses(false);
    }
  }, []);

  const setFilter = useCallback((next: Partial<TrackingFilterParams>) => {
    setFilterState((prev) => {
      const merged = { ...prev, ...next };
      const nextEntries = Object.entries(next);

      const hasRealChange = nextEntries.some(([key, value]) => {
        return prev[key as keyof TrackingFilterParams] !== value;
      });

      return hasRealChange ? merged : prev;
    });
  }, []);

  const fetchStats = useCallback(async (customFilter?: Partial<TrackingFilterParams>) => {
    const smallCollectionPointId = customFilter?.smallCollectionPointId ?? filter.smallCollectionPointId;

    if (!smallCollectionPointId) {
      setStats({ packing: 0, closed: 0, shipping: 0, recycled: 0 });
      return;
    }

    try {
      const baseParams: TrackingFilterParams = {
        ...filter,
        ...customFilter,
        smallCollectionPointId,
        page: 1,
        limit: 1
      };

      const statuses = ['Đang đóng gói', 'Đã đóng thùng', 'Đang vận chuyển', 'Tái chế'];

      const promises = statuses.map((status) => {
        const params: Record<string, any> = { ...baseParams, status };
        Object.keys(params).forEach((key) => {
          if (params[key] === undefined || params[key] === null || params[key] === '') {
            delete params[key];
          }
        });
        return filterPackages(params).then((res) => res.totalItems || 0).catch(() => 0);
      });

      const [packing, closed, shipping, recycled] = await Promise.all(promises);
      setStats({ packing, closed, shipping, recycled });
    } catch {
      setStats({ packing: 0, closed: 0, shipping: 0, recycled: 0 });
    }
  }, [filter]);

  const fetchPackages = useCallback(async (customFilter?: Partial<TrackingFilterParams>) => {
    const smallCollectionPointId = customFilter?.smallCollectionPointId ?? filter.smallCollectionPointId;

    if (!smallCollectionPointId) {
      setPackages([]);
      setTotalPages(1);
      setTotalItems(0);
      setStats({ packing: 0, closed: 0, shipping: 0, recycled: 0 });
      return;
    }

    setLoadingPackages(true);
    setError(null);

    try {
      const params: Record<string, any> = {
        ...filter,
        ...customFilter,
        smallCollectionPointId
      };

      Object.keys(params).forEach((key) => {
        if (params[key] === undefined || params[key] === null || params[key] === '') {
          delete params[key];
        }
      });

      const response = await filterPackages(params);
      setPackages(response.data || []);
      setTotalPages(response.totalPages || 1);
      setTotalItems(response.totalItems || 0);
      void fetchStats(customFilter);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Lỗi khi tải danh sách kiện hàng');
      setPackages([]);
      setTotalPages(1);
      setTotalItems(0);
      setStats({ packing: 0, closed: 0, shipping: 0, recycled: 0 });
    } finally {
      setLoadingPackages(false);
    }
  }, [filter, fetchStats]);

  const fetchPackageDetail = useCallback(async (packageId: string, page = 1, limit = 10) => {
    setLoadingPackageDetail(true);
    setError(null);
    try {
      const data = await getPackageDetail(packageId, page, limit);
      setPackageDetail(data || null);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Lỗi khi tải chi tiết kiện hàng');
      setPackageDetail(null);
    } finally {
      setLoadingPackageDetail(false);
    }
  }, []);

  const clearPackageDetail = useCallback(() => {
    setPackageDetail(null);
  }, []);

  useEffect(() => {
    void fetchCompanies();
  }, [fetchCompanies]);

  useEffect(() => {
    setWarehouses([]);
    void fetchWarehouses(filter.companyId);
  }, [filter.companyId, fetchWarehouses]);

  useEffect(() => {
    void fetchPackages();
  }, [fetchPackages]);

  const value: TrackingContextType = {
    companies,
    warehouses,
    packages,
    packageDetail,
    totalPages,
    totalItems,
    stats,
    filter,
    loadingCompanies,
    loadingWarehouses,
    loadingPackages,
    loadingPackageDetail,
    error,
    fetchCompanies,
    setFilter,
    fetchPackages,
    fetchPackageDetail,
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
