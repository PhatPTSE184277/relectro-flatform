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
  const DELIVERED_UI_STATUS = 'Đã giao';
  const SHIPPING_STATUS = 'Đang vận chuyển';
  const RECYCLED_STATUS = 'Tái chế';

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
    status: DELIVERED_UI_STATUS,
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
      const mergedFilter = {
        ...filter,
        ...customFilter
      };

      const baseParams: Record<string, any> = {
        ...mergedFilter,
        smallCollectionPointId,
        page: 1,
        limit: 1
      };

      delete baseParams.fromDate;
      delete baseParams.toDate;

      const deliveredDateParams: Record<string, any> = {
        fromDate: mergedFilter.fromDate,
        toDate: mergedFilter.toDate
      };

      const sanitizeParams = (params: Record<string, any>) => {
        const next = { ...params };
        Object.keys(next).forEach((key) => {
          if (next[key] === undefined || next[key] === null || next[key] === '') {
            delete next[key];
          }
        });
        return next;
      };

      const [packing, closed, shipping, recycled] = await Promise.all([
        filterPackages(sanitizeParams({ ...baseParams, status: 'Đang đóng gói' })).then((res) => res.totalItems || 0).catch(() => 0),
        filterPackages(sanitizeParams({ ...baseParams, status: 'Đã đóng thùng' })).then((res) => res.totalItems || 0).catch(() => 0),
        filterPackages(sanitizeParams({ ...baseParams, ...deliveredDateParams, status: 'Đang vận chuyển' })).then((res) => res.totalItems || 0).catch(() => 0),
        filterPackages(sanitizeParams({ ...baseParams, ...deliveredDateParams, status: 'Tái chế' })).then((res) => res.totalItems || 0).catch(() => 0)
      ]);

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

      const currentStatus = String(params.status || '');
      const currentPage = Number(params.page || 1);
      const currentLimit = Number(params.limit || 10);

      if (currentStatus !== DELIVERED_UI_STATUS) {
        delete params.fromDate;
        delete params.toDate;
      }

      if (currentStatus === DELIVERED_UI_STATUS) {
        const baseParams: Record<string, any> = {
          ...params,
          status: undefined,
          page: 1,
          limit: 1
        };

        Object.keys(baseParams).forEach((key) => {
          if (baseParams[key] === undefined || baseParams[key] === null || baseParams[key] === '') {
            delete baseParams[key];
          }
        });

        const [shippingTotalRes, recycledTotalRes] = await Promise.all([
          filterPackages({ ...baseParams, status: SHIPPING_STATUS, page: 1, limit: 1 }),
          filterPackages({ ...baseParams, status: RECYCLED_STATUS, page: 1, limit: 1 })
        ]);

        const shippingTotal = shippingTotalRes?.totalItems || 0;
        const recycledTotal = recycledTotalRes?.totalItems || 0;

        const [shippingDataRes, recycledDataRes] = await Promise.all([
          shippingTotal > 0
            ? filterPackages({ ...baseParams, status: SHIPPING_STATUS, page: 1, limit: shippingTotal })
            : Promise.resolve({ data: [], totalPages: 1, totalItems: 0 }),
          recycledTotal > 0
            ? filterPackages({ ...baseParams, status: RECYCLED_STATUS, page: 1, limit: recycledTotal })
            : Promise.resolve({ data: [], totalPages: 1, totalItems: 0 })
        ]);

        const mergedMap = new Map<string, any>();
        [...(shippingDataRes.data || []), ...(recycledDataRes.data || [])].forEach((item: any) => {
          const key = String(item?.packageId || item?.id || '');
          if (!key) return;
          mergedMap.set(key, {
            ...item,
            status: DELIVERED_UI_STATUS
          });
        });

        const mergedPackages = Array.from(mergedMap.values()).sort((a: any, b: any) => {
          const timeA = new Date(a?.deliveryAt || a?.createAt || a?.createdAt || 0).getTime();
          const timeB = new Date(b?.deliveryAt || b?.createAt || b?.createdAt || 0).getTime();
          return timeB - timeA;
        });

        const totalMergedItems = mergedPackages.length;
        const startIndex = (currentPage - 1) * currentLimit;
        const endIndex = startIndex + currentLimit;
        const paginatedMergedPackages = mergedPackages.slice(startIndex, endIndex);

        setPackages(paginatedMergedPackages);
        setTotalItems(totalMergedItems);
        setTotalPages(Math.max(1, Math.ceil(totalMergedItems / currentLimit)));
        void fetchStats(customFilter);
        return;
      }

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
