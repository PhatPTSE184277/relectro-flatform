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
  filterProducts,
  getProductTimeline
} from '@/services/admin/TrackingService';


interface TrackingContextType {
  companies: any[];
  products: any[];
  timeline: any[];
  loadingCompanies: boolean;
  loadingProducts: boolean;
  loadingTimeline: boolean;
  error: string | null;
  fetchCompanies: () => Promise<void>;
  fetchProducts: (companyId: string, fromDate?: string, toDate?: string) => Promise<void>;
  fetchTimeline: (productId: string) => Promise<void>;
  clearCompanies: () => void;
  clearProducts: () => void;
  clearTimeline: () => void;
}


const TrackingContext = createContext<TrackingContextType | undefined>(undefined);


type Props = { children: ReactNode };

export const TrackingProvider: React.FC<Props> = ({ children }) => {
  const [companies, setCompanies] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [timeline, setTimeline] = useState<any[]>([]);
  const [loadingCompanies, setLoadingCompanies] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [loadingTimeline, setLoadingTimeline] = useState(false);
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

  const fetchProducts = useCallback(async (companyId: string, fromDate?: string, toDate?: string) => {
    setLoadingProducts(true);
    setError(null);
    try {
      const params: any = { page: 1, limit: 100, collectionCompanyId: companyId };
      if (fromDate) params.fromDate = fromDate;
      if (toDate) params.toDate = toDate;
      const data = await filterProducts(params);
      setProducts(Array.isArray(data) ? data : (data.data || []));
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Lỗi khi tải danh sách sản phẩm');
      setProducts([]);
    } finally {
      setLoadingProducts(false);
    }
  }, []);

  const fetchTimeline = useCallback(async (productId: string) => {
    setLoadingTimeline(true);
    setError(null);
    try {
      const data = await getProductTimeline(productId);
      setTimeline(data || []);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Lỗi khi tải timeline sản phẩm');
      setTimeline([]);
    } finally {
      setLoadingTimeline(false);
    }
  }, []);

  const clearCompanies = useCallback(() => {
    setCompanies([]);
    setError(null);
  }, []);
  const clearProducts = useCallback(() => {
    setProducts([]);
    setError(null);
  }, []);
  const clearTimeline = useCallback(() => {
    setTimeline([]);
    setError(null);
  }, []);

  useEffect(() => {
    void fetchCompanies();
  }, [fetchCompanies]);

  const value: TrackingContextType = {
    companies,
    products,
    timeline,
    loadingCompanies,
    loadingProducts,
    loadingTimeline,
    error,
    fetchCompanies,
    fetchProducts,
    fetchTimeline,
    clearCompanies,
    clearProducts,
    clearTimeline
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
