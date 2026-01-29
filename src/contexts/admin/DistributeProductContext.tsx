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
    getDistributedProductsByDate
} from '@/services/admin/DistributeProductService';
import { AssignedProduct, AssignProductsRequest } from '@/types/AssignProduct';

interface DistributeProductContextType {
    distributedProducts: AssignedProduct[];
    loading: boolean;
    fetchDistributedProducts: (workDate: string, page?: number, pageSize?: number) => Promise<void>;
    distributeProductsToDate: (data: AssignProductsRequest) => Promise<any>;
    page: number;
    setPage: (page: number) => void;
    totalPages: number;
    pageSize: number;
}

const DistributeProductContext = createContext<
    DistributeProductContextType | undefined
>(undefined);

type Props = { children: ReactNode };

export const DistributeProductProvider: React.FC<Props> = ({ children }) => {
    const [distributedProducts, setDistributedProducts] = useState<AssignedProduct[]>([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
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
        loading,
        fetchDistributedProducts,
        distributeProductsToDate,
        page,
        setPage,
        totalPages,
        pageSize
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
