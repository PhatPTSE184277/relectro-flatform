'use client';

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
} from 'react';
import { getProductsByCompany } from '@/services/company/ProductQueryService';

interface ProductQueryContextType {
  loading: boolean;
  products: any[];
  error: string | null;
  fetchProducts: (companyId: number, workDate: string) => Promise<void>;
  clearProducts: () => void;
}

const ProductQueryContext = createContext<ProductQueryContextType | undefined>(undefined);

export const ProductQueryProvider = ({ children }: { children: ReactNode }) => {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async (companyId: number, workDate: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getProductsByCompany(companyId, workDate);
      setProducts(data?.products || []);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Lỗi khi tải sản phẩm');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearProducts = useCallback(() => {
    setProducts([]);
    setError(null);
  }, []);

  return (
    <ProductQueryContext.Provider value={{ loading, products, error, fetchProducts, clearProducts }}>
      {children}
    </ProductQueryContext.Provider>
  );
};

export const useProductQueryContext = () => {
  const context = useContext(ProductQueryContext);
  if (!context) throw new Error('useProductQueryContext must be used within ProductQueryProvider');
  return context;
};
