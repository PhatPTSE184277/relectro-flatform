'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import {
  getAssignedCollectionPointsSummary,
  getAssignedProductsByCollectionPoint,
  AssignedPointProductsResponse
} from '@/services/admin/AssignedProductService';

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

interface AssignedProductContextType {
  companies: CompanySummary[];
  loading: boolean;
  fetchCompanies: (workDate: string) => Promise<void>;
  selectedCompany: CompanySummary | null;
  setSelectedCompany: (company: CompanySummary | null) => void;
  selectedPoint: CollectionPoint | null;
  setSelectedPoint: (point: CollectionPoint | null) => void;
  pointProducts: AssignedPointProductsResponse | null;
  productPage: number;
  productTotalPages: number;
  setProductPage: (page: number) => void;
  fetchPointProducts: (smallPointId: string, workDate: string, page?: number, limit?: number) => Promise<void>;
}

const AssignedProductContext = createContext<AssignedProductContextType | undefined>(undefined);

type Props = { children: ReactNode };

export const AssignedProductProvider: React.FC<Props> = ({ children }) => {
  const [companies, setCompanies] = useState<CompanySummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<CompanySummary | null>(null);
  const [selectedPoint, setSelectedPoint] = useState<CollectionPoint | null>(null);
  const [pointProducts, setPointProducts] = useState<AssignedPointProductsResponse | null>(null);
  const [productPage, setProductPage] = useState<number>(1);
  const [productTotalPages, setProductTotalPages] = useState<number>(1);

  const fetchCompanies = useCallback(async (workDate: string) => {
    setLoading(true);
    try {
      const res = await getAssignedCollectionPointsSummary(workDate);
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
      const res = await getAssignedProductsByCollectionPoint(smallPointId, workDate, page, limit);
      setPointProducts(res);
      setProductTotalPages(res.totalPages || 1);
    } catch (err) {
        console.log(err)
      setPointProducts(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const value: AssignedProductContextType = {
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
    <AssignedProductContext.Provider value={value}>
      {children}
    </AssignedProductContext.Provider>
  );
};

export const useAssignedProductContext = (): AssignedProductContextType => {
  const ctx = useContext(AssignedProductContext);
  if (!ctx) throw new Error('useAssignedProductContext must be used within AssignedProductProvider');
  return ctx;
};
