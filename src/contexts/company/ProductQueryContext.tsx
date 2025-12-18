'use client';

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
} from 'react';
import { getProductsByCompany, getSmallPoints } from '@/services/company/ProductQueryService';

interface ProductQueryContextType {
  loading: boolean;
  products: any;
  error: string | null;
  smallPoints: any[];
  loadingPoints: boolean;
  fetchProducts: (companyId: string, workDate: string) => Promise<void>;
  fetchSmallPoints: (companyId: string) => Promise<void>;
  clearProducts: () => void;
}

const ProductQueryContext = createContext<ProductQueryContextType | undefined>(undefined);

export const ProductQueryProvider = ({ children }: { children: ReactNode }) => {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [smallPoints, setSmallPoints] = useState<any[]>([]);
  const [loadingPoints, setLoadingPoints] = useState(false);

  const fetchProducts = useCallback(async (companyId: string, workDate: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getProductsByCompany(companyId, workDate);
      setProducts(data);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Lỗi khi tải sản phẩm');
      setProducts(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchSmallPoints = useCallback(async (companyId: string) => {
    setLoadingPoints(true);
    try {
      const data = await getSmallPoints(companyId);
      setSmallPoints(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.error('Error fetching small points:', err);
      setSmallPoints([]);
    } finally {
      setLoadingPoints(false);
    }
  }, []);

  const clearProducts = useCallback(() => {
    setProducts(null);
    setError(null);
  }, []);

  return (
    <ProductQueryContext.Provider value={{ loading, products, error, smallPoints, loadingPoints, fetchProducts, fetchSmallPoints, clearProducts }}>
      {children}
    </ProductQueryContext.Provider>
  );
};

export const useProductQueryContext = () => {
  const context = useContext(ProductQueryContext);
  if (!context) throw new Error('useProductQueryContext must be used within ProductQueryProvider');
  return context;
};
