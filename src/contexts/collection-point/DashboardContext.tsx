'use client';
import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import {
  getSCPStats,
  getSCPStatsByDay,
  getPackageStats,
  getSCPBrandStats,
  getSCPBrandStatsByDay,
  getTopUsers,
  getUserProducts,
  getBrandDetails,
  getDashboardProductById,
  updateDashboardProductPoints,
  SCPStatsResponse,
  SCPBrandStatsResponse,
  TopUsersResponse,
  UserProduct,
  PackageStatsResponse,
  BrandDetailsResponse
} from '@/services/collection-point/DashboardService';
import { useAuth } from '@/hooks/useAuth';
import type { Product } from '@/types/Product';

interface DashboardContextType {
  summary: SCPStatsResponse | null;
  brandSummary: SCPBrandStatsResponse | null;
  topUsers: TopUsersResponse | null;
  userProducts: UserProduct[];
  brandDetails: BrandDetailsResponse | null;
  selectedProductDetail: Product | null;
  loading: boolean;
  productDetailLoading: boolean;
  pointUpdateLoading: boolean;
  fetchSummary: (fromDate: string, toDate: string) => Promise<void>;
  fetchSummaryByDay: (date: string) => Promise<void>;
  fetchBrandSummary: (fromDate: string, toDate: string) => Promise<void>;
  fetchBrandSummaryByDay: (date: string) => Promise<void>;
  fetchTopUsers: (fromDate: string, toDate: string, top?: number) => Promise<void>;
  fetchUserProducts: (userId: string) => Promise<void>;
  fetchBrandDetails: (brandName: string, fromDate: string, toDate: string, page?: number, limit?: number) => Promise<void>;
  fetchProductDetail: (productId: string) => Promise<void>;
  clearSelectedProductDetail: () => void;
  updateProductPoint: (productId: string, newPointValue: number, reasonForUpdate: string) => Promise<boolean>;
  fetchPackageStats: (fromDate: string, toDate: string) => Promise<PackageStatsResponse | null>;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export const DashboardProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth(); // Get user from auth context
  const [summary, setSummary] = useState<SCPStatsResponse | null>(null);
  const [brandSummary, setBrandSummary] = useState<SCPBrandStatsResponse | null>(null);
  const [topUsers, setTopUsers] = useState<TopUsersResponse | null>(null);
  const [userProducts, setUserProducts] = useState<UserProduct[]>([]);
  const [brandDetails, setBrandDetails] = useState<BrandDetailsResponse | null>(null);
  const [selectedProductDetail, setSelectedProductDetail] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [productDetailLoading, setProductDetailLoading] = useState(false);
  const [pointUpdateLoading, setPointUpdateLoading] = useState(false);

  const fetchSummary = useCallback(async (fromDate: string, toDate: string) => {
    if (!user?.smallCollectionPointId) {
      console.warn('No smallCollectionPointId found in user profile');
      return;
    }
    setLoading(true);
    try {
      const res = await getSCPStats(user.smallCollectionPointId, fromDate, toDate);
      setSummary(res);
    } catch (err) {
      console.log(err);
      setSummary(null);
    } finally {
      setLoading(false);
    }
  }, [user?.smallCollectionPointId]);

  const fetchSummaryByDay = useCallback(async (date: string) => {
    if (!user?.smallCollectionPointId) {
      console.warn('No smallCollectionPointId found in user profile');
      return;
    }
    setLoading(true);
    try {
      const res = await getSCPStatsByDay(user.smallCollectionPointId, date);
      setSummary(res);
    } catch (err) {
      console.log(err);
      setSummary(null);
    } finally {
      setLoading(false);
    }
  }, [user?.smallCollectionPointId]);

  const fetchBrandSummary = useCallback(async (fromDate: string, toDate: string) => {
    if (!user?.smallCollectionPointId) {
      console.warn('No smallCollectionPointId found in user profile');
      return;
    }
    setLoading(true);
    try {
      const res = await getSCPBrandStats(user.smallCollectionPointId, fromDate, toDate);
      setBrandSummary(res);
    } catch (err) {
      console.log(err);
      setBrandSummary(null);
    } finally {
      setLoading(false);
    }
  }, [user?.smallCollectionPointId]);

  const fetchBrandSummaryByDay = useCallback(async (date: string) => {
    if (!user?.smallCollectionPointId) {
      console.warn('No smallCollectionPointId found in user profile');
      return;
    }
    setLoading(true);
    try {
      const res = await getSCPBrandStatsByDay(user.smallCollectionPointId, date);
      setBrandSummary(res);
    } catch (err) {
      console.log(err);
      setBrandSummary(null);
    } finally {
      setLoading(false);
    }
  }, [user?.smallCollectionPointId]);

  const fetchTopUsers = useCallback(async (fromDate: string, toDate: string, top: number = 20) => {
    if (!user?.smallCollectionPointId) {
      console.warn('No smallCollectionPointId found in user profile');
      return;
    }
    setLoading(true);
    try {
      const res = await getTopUsers(user.smallCollectionPointId, fromDate, toDate, top);
      setTopUsers(res);
    } catch (err) {
      console.log(err);
      setTopUsers(null);
    } finally {
      setLoading(false);
    }
  }, [user?.smallCollectionPointId]);

    const fetchUserProducts = useCallback(async (userId: string) => {
      setLoading(true);
      try {
        const res = await getUserProducts(userId);
        setUserProducts(res);
      } catch (err) {
        console.log(err);
        setUserProducts([]);
      } finally {
        setLoading(false);
      }
    }, []);

  const fetchBrandDetails = useCallback(async (
    brandName: string,
    fromDate: string,
    toDate: string,
    page: number = 1,
    limit: number = 10
  ) => {
    if (!user?.smallCollectionPointId) {
      console.warn('No smallCollectionPointId found in user profile');
      return;
    }
    setLoading(true);
    try {
      const res = await getBrandDetails(
        brandName,
        fromDate,
        toDate,
        page,
        limit,
        user.smallCollectionPointId
      );
      setBrandDetails(res);
    } catch (err) {
      console.log(err);
      setBrandDetails(null);
    } finally {
      setLoading(false);
    }
  }, [user?.smallCollectionPointId]);

  const fetchProductDetail = useCallback(async (productId: string) => {
    setProductDetailLoading(true);
    try {
      const res = await getDashboardProductById(productId);
      setSelectedProductDetail(res);
    } catch (err) {
      console.log(err);
      setSelectedProductDetail(null);
    } finally {
      setProductDetailLoading(false);
    }
  }, []);

  const clearSelectedProductDetail = useCallback(() => {
    setSelectedProductDetail(null);
  }, []);

  const updateProductPoint = useCallback(async (
    productId: string,
    newPointValue: number,
    reasonForUpdate: string
  ) => {
    setPointUpdateLoading(true);
    try {
      await updateDashboardProductPoints(productId, newPointValue, reasonForUpdate);
      return true;
    } catch (err) {
      console.log(err);
      return false;
    } finally {
      setPointUpdateLoading(false);
    }
  }, []);
  const fetchPackageStats = useCallback(async (fromDate: string, toDate: string) => {
    if (!user?.smallCollectionPointId) {
      console.warn('No smallCollectionPointId found in user profile');
      return null;
    }
    setLoading(true);
    try {
      const res = await getPackageStats(user.smallCollectionPointId, fromDate, toDate);
      return res;
    } catch (err) {
      console.log(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [user?.smallCollectionPointId]);

  const value: DashboardContextType = {
    summary,
    brandSummary,
    topUsers,
    userProducts,
    brandDetails,
    selectedProductDetail,
    loading,
    productDetailLoading,
    pointUpdateLoading,
    fetchSummary,
    fetchSummaryByDay,
    fetchBrandSummary,
    fetchBrandSummaryByDay,
    fetchTopUsers,
    fetchUserProducts,
    fetchBrandDetails,
    fetchProductDetail,
    clearSelectedProductDetail,
    updateProductPoint,
    fetchPackageStats,
  };

  return <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>;
};

export const useDashboardContext = (): DashboardContextType => {
  const ctx = useContext(DashboardContext);
  if (!ctx) throw new Error('useDashboardContext must be used within DashboardProvider');
  return ctx;
};
