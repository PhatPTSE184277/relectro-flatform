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
  BrandDetailsResponse,
  OverdueSummaryItem,
  OverdueDetailsResponse,
  ForceReceiveOverduePayload,
  getOverdueSummaries,
  getOverdueDetails,
  forceReceiveOverdueProduct
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
  overdueSummaries: OverdueSummaryItem[];
  overdueDetails: OverdueDetailsResponse | null;
  loading: boolean;
  productDetailLoading: boolean;
  pointUpdateLoading: boolean;
  overdueLoading: boolean;
  overdueDetailLoading: boolean;
  forceReceiveLoading: boolean;
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
  fetchOverdueSummaries: () => Promise<void>;
  fetchOverdueDetails: (scpId: string, page?: number, limit?: number) => Promise<void>;
  forceReceiveOverdue: (payload: ForceReceiveOverduePayload) => Promise<boolean>;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export const DashboardProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [summary, setSummary] = useState<SCPStatsResponse | null>(null);
  const [brandSummary, setBrandSummary] = useState<SCPBrandStatsResponse | null>(null);
  const [topUsers, setTopUsers] = useState<TopUsersResponse | null>(null);
  const [userProducts, setUserProducts] = useState<UserProduct[]>([]);
  const [brandDetails, setBrandDetails] = useState<BrandDetailsResponse | null>(null);
  const [selectedProductDetail, setSelectedProductDetail] = useState<Product | null>(null);
  const [overdueSummaries, setOverdueSummaries] = useState<OverdueSummaryItem[]>([]);
  const [overdueDetails, setOverdueDetails] = useState<OverdueDetailsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [productDetailLoading, setProductDetailLoading] = useState(false);
  const [pointUpdateLoading, setPointUpdateLoading] = useState(false);
  const [overdueLoading, setOverdueLoading] = useState(false);
  const [overdueDetailLoading, setOverdueDetailLoading] = useState(false);
  const [forceReceiveLoading, setForceReceiveLoading] = useState(false);

  const fetchSummary = useCallback(async (fromDate: string, toDate: string) => {
    if (!user?.smallCollectionPointId) return;
    setLoading(true);
    try { setSummary(await getSCPStats(user.smallCollectionPointId, fromDate, toDate)); } catch (err) { console.log(err); setSummary(null); } finally { setLoading(false); }
  }, [user?.smallCollectionPointId]);

  const fetchSummaryByDay = useCallback(async (date: string) => {
    if (!user?.smallCollectionPointId) return;
    setLoading(true);
    try { setSummary(await getSCPStatsByDay(user.smallCollectionPointId, date)); } catch (err) { console.log(err); setSummary(null); } finally { setLoading(false); }
  }, [user?.smallCollectionPointId]);

  const fetchBrandSummary = useCallback(async (fromDate: string, toDate: string) => {
    if (!user?.smallCollectionPointId) return;
    setLoading(true);
    try { setBrandSummary(await getSCPBrandStats(user.smallCollectionPointId, fromDate, toDate)); } catch (err) { console.log(err); setBrandSummary(null); } finally { setLoading(false); }
  }, [user?.smallCollectionPointId]);

  const fetchBrandSummaryByDay = useCallback(async (date: string) => {
    if (!user?.smallCollectionPointId) return;
    setLoading(true);
    try { setBrandSummary(await getSCPBrandStatsByDay(user.smallCollectionPointId, date)); } catch (err) { console.log(err); setBrandSummary(null); } finally { setLoading(false); }
  }, [user?.smallCollectionPointId]);

  const fetchTopUsers = useCallback(async (fromDate: string, toDate: string, top: number = 20) => {
    if (!user?.smallCollectionPointId) return;
    setLoading(true);
    try { setTopUsers(await getTopUsers(user.smallCollectionPointId, fromDate, toDate, top)); } catch (err) { console.log(err); setTopUsers(null); } finally { setLoading(false); }
  }, [user?.smallCollectionPointId]);

  const fetchUserProducts = useCallback(async (userId: string) => {
    setLoading(true);
    try { setUserProducts(await getUserProducts(userId)); } catch (err) { console.log(err); setUserProducts([]); } finally { setLoading(false); }
  }, []);

  const fetchBrandDetails = useCallback(async (brandName: string, fromDate: string, toDate: string, page: number = 1, limit: number = 10) => {
    if (!user?.smallCollectionPointId) return;
    setLoading(true);
    try { setBrandDetails(await getBrandDetails(brandName, fromDate, toDate, page, limit, user.smallCollectionPointId)); } catch (err) { console.log(err); setBrandDetails(null); } finally { setLoading(false); }
  }, [user?.smallCollectionPointId]);

  const fetchProductDetail = useCallback(async (productId: string) => {
    setProductDetailLoading(true);
    try { setSelectedProductDetail(await getDashboardProductById(productId)); } catch (err) { console.log(err); setSelectedProductDetail(null); } finally { setProductDetailLoading(false); }
  }, []);

  const clearSelectedProductDetail = useCallback(() => { setSelectedProductDetail(null); }, []);

  const updateProductPoint = useCallback(async (productId: string, newPointValue: number, reasonForUpdate: string) => {
    setPointUpdateLoading(true);
    try { await updateDashboardProductPoints(productId, newPointValue, reasonForUpdate); return true; } catch (err) { console.log(err); return false; } finally { setPointUpdateLoading(false); }
  }, []);

  const fetchPackageStats = useCallback(async (fromDate: string, toDate: string) => {
    if (!user?.smallCollectionPointId) return null;
    setLoading(true);
    try { return await getPackageStats(user.smallCollectionPointId, fromDate, toDate); } catch (err) { console.log(err); return null; } finally { setLoading(false); }
  }, [user?.smallCollectionPointId]);

  const fetchOverdueSummaries = useCallback(async () => {
    setOverdueLoading(true);
    try { setOverdueSummaries(await getOverdueSummaries()); } catch (err) { console.log(err); setOverdueSummaries([]); } finally { setOverdueLoading(false); }
  }, []);

  const fetchOverdueDetails = useCallback(async (scpId: string, page: number = 1, limit: number = 10) => {
    setOverdueDetailLoading(true);
    try { setOverdueDetails(await getOverdueDetails(scpId, page, limit)); } catch (err) { console.log(err); setOverdueDetails(null); } finally { setOverdueDetailLoading(false); }
  }, []);

  const forceReceiveOverdue = useCallback(async (payload: ForceReceiveOverduePayload) => {
    setForceReceiveLoading(true);
    try { await forceReceiveOverdueProduct(payload); return true; } catch (err) { console.log(err); return false; } finally { setForceReceiveLoading(false); }
  }, []);

  const value: DashboardContextType = {
    summary,
    brandSummary,
    topUsers,
    userProducts,
    brandDetails,
    selectedProductDetail,
    overdueSummaries,
    overdueDetails,
    loading,
    productDetailLoading,
    pointUpdateLoading,
    overdueLoading,
    overdueDetailLoading,
    forceReceiveLoading,
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
    fetchOverdueSummaries,
    fetchOverdueDetails,
    forceReceiveOverdue
  };

  return <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>;
};

export const useDashboardContext = (): DashboardContextType => {
  const ctx = useContext(DashboardContext);
  if (!ctx) throw new Error('useDashboardContext must be used within DashboardProvider');
  return ctx;
};
