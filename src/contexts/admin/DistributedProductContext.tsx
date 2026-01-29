'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import {
  getDistributedCollectionPointsSummary,
  getDistributedProductsByCollectionPoint,
  DistributedPointProductsResponse
} from '@/services/admin/DistributedProductService';

interface CollectionPoint {
  smallCollectionId: string;
  name: string;
  totalProduct: number;
}

interface CompanySummary {
  companyId: string;
  companyName: string;
  totalCompanyProducts: number;
  points: CollectionPoint[];
}

interface DistributedProductContextType {
  companies: CompanySummary[];
  loading: boolean;
  fetchCompanies: (workDate: string) => Promise<void>;
  selectedCompany: CompanySummary | null;
  setSelectedCompany: (company: CompanySummary | null) => void;
  selectedPoint: CollectionPoint | null;
  setSelectedPoint: (point: CollectionPoint | null) => void;
  pointProducts: DistributedPointProductsResponse | null;
  productPage: number;
  productTotalPages: number;
  setProductPage: (page: number) => void;
  fetchPointProducts: (smallPointId: string, workDate: string, page?: number, limit?: number) => Promise<void>;
}

const DistributedProductContext = createContext<DistributedProductContextType | undefined>(undefined);

type Props = { children: ReactNode };

export const DistributedProductProvider: React.FC<Props> = ({ children }) => {
  const [companies, setCompanies] = useState<CompanySummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<CompanySummary | null>(null);
  const [selectedPoint, setSelectedPoint] = useState<CollectionPoint | null>(null);
  const [pointProducts, setPointProducts] = useState<DistributedPointProductsResponse | null>(null);
  const [productPage, setProductPage] = useState<number>(1);
  const [productTotalPages, setProductTotalPages] = useState<number>(1);

  const fetchCompanies = useCallback(async (workDate: string) => {
    setLoading(true);
    try {
      const res = await getDistributedCollectionPointsSummary(workDate);
      if (res && res.data) {
        setCompanies(res.data);
      } else {
        setCompanies([]);
      }
    } catch (err) {
        console.log(err)
      setCompanies([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchPointProducts = useCallback(async (smallPointId: string, workDate: string, page: number = 1, limit: number = 10) => {
    setLoading(true);
    try {
      const res = await getDistributedProductsByCollectionPoint(smallPointId, workDate, page, limit);
      setPointProducts(res);
      setProductTotalPages(res.totalPages || 1);
    } catch (err) {
        console.log(err)
      setPointProducts(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const value: DistributedProductContextType = {
    companies,
    loading,
    fetchCompanies,
    selectedCompany,
    setSelectedCompany,
    selectedPoint,
    setSelectedPoint,
    productPage,
    productTotalPages,
    setProductPage,
    pointProducts,
    fetchPointProducts
  };

  return (
    <DistributedProductContext.Provider value={value}>
      {children}
    </DistributedProductContext.Provider>
  );
};

export const useDistributedProductContext = (): DistributedProductContextType => {
  const ctx = useContext(DistributedProductContext);
  if (!ctx) throw new Error('useDistributedProductContext must be used within DistributedProductProvider');
  return ctx;
};
