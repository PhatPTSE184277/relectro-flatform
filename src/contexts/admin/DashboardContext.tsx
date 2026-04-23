'use client';

import React, {
    createContext,
    useContext,
    useState,
    useCallback,
    ReactNode
} from 'react';
import {
    getDashboardSummary,
    getDashboardSummaryByDay,
    getBrandSummary,
    getBrandSummaryByDay,
    getTopUsers,
    getUserProducts,
    getBrandDetails,
    getDashboardProductById,
    updateDashboardProductPoints,
    DashboardSummaryResponse,
    AdminBrandSummaryResponse,
    TopUsersResponse,
    UserProduct,
    BrandDetailsResponse
} from '@/services/admin/DashboardService';
import type { Product } from '@/types/Product';

interface DashboardContextType {
    summary: DashboardSummaryResponse | null;
    brandSummary: AdminBrandSummaryResponse | null;
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
    fetchBrandDetails: (brandName: string, fromDate: string, toDate: string, page?: number, limit?: number, scpId?: string) => Promise<void>;
    fetchProductDetail: (productId: string) => Promise<void>;
    clearSelectedProductDetail: () => void;
    updateProductPoint: (productId: string, newPointValue: number, reasonForUpdate: string) => Promise<boolean>;
}

const DashboardContext = createContext<DashboardContextType | undefined>(
    undefined
);

type Props = { children: ReactNode };

export const DashboardProvider: React.FC<Props> = ({ children }) => {
    const [summary, setSummary] = useState<DashboardSummaryResponse | null>(
        null
    );
    const [brandSummary, setBrandSummary] = useState<AdminBrandSummaryResponse | null>(null);
    const [topUsers, setTopUsers] = useState<TopUsersResponse | null>(null);
    const [userProducts, setUserProducts] = useState<UserProduct[]>([]);
    const [brandDetails, setBrandDetails] = useState<BrandDetailsResponse | null>(null);
    const [selectedProductDetail, setSelectedProductDetail] = useState<Product | null>(null);
    const [loading, setLoading] = useState(false);
    const [productDetailLoading, setProductDetailLoading] = useState(false);
    const [pointUpdateLoading, setPointUpdateLoading] = useState(false);

    const fetchSummary = useCallback(
        async (fromDate: string, toDate: string) => {
            setLoading(true);
            try {
                const res = await getDashboardSummary(fromDate, toDate);
                setSummary(res);
            } catch (err) {
                console.log(err);
            } finally {
                setLoading(false);
            }
        },
        []
    );

    const fetchSummaryByDay = useCallback(async (date: string) => {
        setLoading(true);
        try {
            const res = await getDashboardSummaryByDay(date);
            setSummary(res);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchBrandSummary = useCallback(async (fromDate: string, toDate: string) => {
        setLoading(true);
        try {
            const res = await getBrandSummary(fromDate, toDate);
            setBrandSummary(res);
        } catch (err) {
            console.log(err);
            setBrandSummary(null);
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchBrandSummaryByDay = useCallback(async (date: string) => {
        setLoading(true);
        try {
            const res = await getBrandSummaryByDay(date);
            setBrandSummary(res);
        } catch (err) {
            console.log(err);
            setBrandSummary(null);
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchTopUsers = useCallback(async (fromDate: string, toDate: string, top: number = 20) => {
        setLoading(true);
        try {
            const res = await getTopUsers(fromDate, toDate, top);
            setTopUsers(res);
        } catch (err) {
            console.log(err);
            setTopUsers(null);
        } finally {
            setLoading(false);
        }
    }, []);

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
        limit: number = 10,
        scpId?: string
    ) => {
        setLoading(true);
        try {
            const res = await getBrandDetails(brandName, fromDate, toDate, page, limit, scpId);
            setBrandDetails(res);
        } catch (err) {
            console.log(err);
            setBrandDetails(null);
        } finally {
            setLoading(false);
        }
    }, []);

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
        updateProductPoint
    };

    return (
        <DashboardContext.Provider value={value}>
            {children}
        </DashboardContext.Provider>
    );
};

export const useDashboardContext = (): DashboardContextType => {
    const ctx = useContext(DashboardContext);
    if (!ctx)
        throw new Error(
            'useDashboardContext must be used within DashboardProvider'
        );
    return ctx;
};
