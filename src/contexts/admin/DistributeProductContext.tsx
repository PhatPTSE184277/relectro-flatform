'use client';

import React, {
    createContext,
    useContext,
    useState,
    useCallback,
    ReactNode
} from 'react';
import {
    distributeProducts,
    getDistributedProductsByDate,
    getUndistributedProducts,
    getCompanyMetricsByDate,
    getSCPProductsStatus,
    getCollectionCompanies
} from '@/services/admin/DistributeProductService';
import { AssignedProduct, AssignProductsRequest } from '@/types/AssignProduct';

interface DistributeProductContextType {
    distributedProducts: AssignedProduct[];
    undistributedProducts: any[];
    allUndistributedProducts: any[];
    companies: any[];
    collectionCompanies: any[];
    scpProducts: any[];
    scpProductsData: any;
    loading: boolean;
    companyLoading: boolean;
    collectionCompaniesLoading: boolean;
    scpLoading: boolean;
    activeFilter: 'undistributed' | 'distributed';
    setActiveFilter: (filter: 'undistributed' | 'distributed') => void;
    fetchDistributedProducts: (workDate: string, page?: number, pageSize?: number) => Promise<void>;
    fetchUndistributedProducts: (workDate: string, page?: number, limit?: number) => Promise<void>;
    fetchCompanies: (workDate: string) => Promise<void>;
    fetchCollectionCompanies: (page?: number, limit?: number) => Promise<void>;
    clearUndistributedProducts: () => void;
    fetchSCPProducts: (smallPointId: string, workDate: string, page?: number, limit?: number) => Promise<void>;
    distributeProductsToDate: (data: AssignProductsRequest) => Promise<any>;
    page: number;
    setPage: (page: number) => void;
    totalPages: number;
    pageSize: number;
    scpPage: number;
    setScpPage: (page: number) => void;
    scpTotalPages: number;
}

const DistributeProductContext = createContext<
    DistributeProductContextType | undefined
>(undefined);

type Props = { children: ReactNode };

export const DistributeProductProvider: React.FC<Props> = ({ children }) => {
    const [distributedProducts, setDistributedProducts] = useState<AssignedProduct[]>([]);
    const [undistributedProducts, setUndistributedProducts] = useState<any[]>([]);
    const [allUndistributedProducts, setAllUndistributedProducts] = useState<any[]>([]);
    const [companies, setCompanies] = useState<any[]>([]);
    const [collectionCompanies, setCollectionCompanies] = useState<any[]>([]);
    const [scpProducts, setScpProducts] = useState<any[]>([]);
    const [scpProductsData, setScpProductsData] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [companyLoading, setCompanyLoading] = useState(false);
    const [collectionCompaniesLoading, setCollectionCompaniesLoading] = useState(false);
    const [scpLoading, setScpLoading] = useState(false);
    const [activeFilter, setActiveFilter] = useState<'undistributed' | 'distributed'>('undistributed');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [scpPage, setScpPage] = useState(1);
    const [scpTotalPages, setScpTotalPages] = useState(1);
    const pageSize = 10;

    const fetchDistributedProducts = useCallback(async (workDate: string, pageArg?: number, pageSizeArg?: number) => {
        setLoading(true);
        try {
            const currentPage = pageArg ?? page;
            const currentPageSize = pageSizeArg ?? pageSize;
            const data = await getDistributedProductsByDate(workDate);

            // API returns AssignedProduct[]
            if (Array.isArray(data)) {
                // Client-side pagination
                setTotalPages(Math.max(1, Math.ceil(data.length / currentPageSize)));
                setDistributedProducts(data.slice((currentPage - 1) * currentPageSize, currentPage * currentPageSize));
            } else {
                setDistributedProducts([]);
                setTotalPages(1);
            }
        } catch (err) {
            console.log(err);
            setDistributedProducts([]);
            setTotalPages(1);
        } finally {
            setLoading(false);
        }
    }, [page, pageSize]);

    const fetchUndistributedProducts = useCallback(async (workDate: string, pageArg?: number, limitArg?: number) => {
        setLoading(true);
        try {
            const currentPage = pageArg ?? page;
            const currentLimit = limitArg ?? pageSize;
            
            // Fetch all products once (use very large limit)
            const data = await getUndistributedProducts(workDate, 1, 999999);
            
            let allProducts: any[] = [];
            // API returns array directly or object with products property
            if (Array.isArray(data)) {
                allProducts = data;
            } else if (data && data.products) {
                allProducts = data.products;
            }
            
            // Store all products
            setAllUndistributedProducts(allProducts);
            
            // Calculate total pages
            const totalPagesCalc = Math.max(1, Math.ceil(allProducts.length / currentLimit));
            setTotalPages(totalPagesCalc);
            
            // Client-side pagination: slice array for current page
            const startIndex = (currentPage - 1) * currentLimit;
            const endIndex = startIndex + currentLimit;
            const paginatedProducts = allProducts.slice(startIndex, endIndex);
            
            setUndistributedProducts(paginatedProducts);
        } catch (err) {
            console.log(err);
            setAllUndistributedProducts([]);
            setUndistributedProducts([]);
            setTotalPages(1);
        } finally {
            setLoading(false);
        }
    }, [page, pageSize]);

    const clearUndistributedProducts = useCallback(() => {
        setAllUndistributedProducts([]);
        setUndistributedProducts([]);
        setTotalPages(1);
    }, []);

    const fetchCompanies = useCallback(async (workDate: string) => {
        setCompanyLoading(true);
        try {
            const data = await getCompanyMetricsByDate(workDate);
            if (Array.isArray(data)) {
                setCompanies(data);
            } else {
                setCompanies([]);
            }
        } catch (err) {
            console.log(err);
            setCompanies([]);
        } finally {
            setCompanyLoading(false);
        }
    }, []);

    const fetchCollectionCompanies = useCallback(async (pageArg?: number, limitArg?: number) => {
        setCollectionCompaniesLoading(true);
        try {
            const currentPage = pageArg ?? 1;
            const currentLimit = limitArg ?? 9999;
            const response = await getCollectionCompanies(currentPage, currentLimit);
            
            if (response && response.data) {
                setCollectionCompanies(response.data);
            } else if (Array.isArray(response)) {
                setCollectionCompanies(response);
            } else {
                setCollectionCompanies([]);
            }
        } catch (err) {
            console.log(err);
            setCollectionCompanies([]);
        } finally {
            setCollectionCompaniesLoading(false);
        }
    }, []);

    const fetchSCPProducts = useCallback(async (smallPointId: string, workDate: string, pageArg?: number, limitArg?: number) => {
        setScpLoading(true);
        try {
            const currentPage = pageArg ?? scpPage;
            const currentLimit = limitArg ?? pageSize;
            const data = await getSCPProductsStatus(smallPointId, workDate, currentPage, currentLimit);
            
            if (data && data.products) {
                setScpProducts(data.products);
                setScpProductsData(data);
                setScpTotalPages(data.totalPages || 1);
            } else {
                setScpProducts([]);
                setScpProductsData(null);
                setScpTotalPages(1);
            }
        } catch (err) {
            console.log(err);
            setScpProducts([]);
            setScpProductsData(null);
            setScpTotalPages(1);
        } finally {
            setScpLoading(false);
        }
    }, [scpPage, pageSize]);

    const distributeProductsToDate = useCallback(
        async (data: AssignProductsRequest) => {
            setLoading(true);
            try {
                const res = await distributeProducts(data);
                return res;
            } catch (err) {
                console.log(err);
                return null;
            } finally {
                setLoading(false);
            }
        },
        []
    );

    const value: DistributeProductContextType = {
        distributedProducts,
        undistributedProducts,
        allUndistributedProducts,
        companies,
        collectionCompanies,
        scpProducts,
        scpProductsData,
        loading,
        companyLoading,
        collectionCompaniesLoading,
        scpLoading,
        activeFilter,
        setActiveFilter,
        fetchDistributedProducts,
        fetchUndistributedProducts,
        fetchCompanies,
        fetchCollectionCompanies,
        fetchSCPProducts,
        clearUndistributedProducts,
        distributeProductsToDate,
        page,
        setPage,
        totalPages,
        pageSize,
        scpPage,
        setScpPage,
        scpTotalPages
    };

    return (
        <DistributeProductContext.Provider value={value}>
            {children}
        </DistributeProductContext.Provider>
    );
};

export const useDistributeProductContext = (): DistributeProductContextType => {
    const ctx = useContext(DistributeProductContext);
    if (!ctx)
        throw new Error(
            'useDistributeProductContext must be used within DistributeProductProvider'
        );
    return ctx;
};
