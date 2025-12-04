'use client';

import React, {
    createContext,
    useContext,
    useState,
    useCallback,
    ReactNode
} from 'react';
import {
    assignProducts,
    getAssignedProductsByDate
} from '@/services/admin/AssignProductService';
import { AssignedProduct, AssignProductsRequest } from '@/types/AssignProduct';
import { toast } from 'react-toastify';

interface AssignProductContextType {
    assignedProducts: AssignedProduct[];
    loading: boolean;
    fetchAssignedProducts: (workDate: string, page?: number, pageSize?: number) => Promise<void>;
    assignProductsToDate: (data: AssignProductsRequest) => Promise<any>;
    page: number;
    setPage: (page: number) => void;
    totalPages: number;
    pageSize: number;
}

const AssignProductContext = createContext<
    AssignProductContextType | undefined
>(undefined);

type Props = { children: ReactNode };

export const AssignProductProvider: React.FC<Props> = ({ children }) => {
    const [assignedProducts, setAssignedProducts] = useState<AssignedProduct[]>([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const pageSize = 10;

    const fetchAssignedProducts = useCallback(async (workDate: string, pageArg?: number, pageSizeArg?: number) => {
        setLoading(true);
        try {
            const currentPage = pageArg ?? page;
            const currentPageSize = pageSizeArg ?? pageSize;
            const data = await getAssignedProductsByDate(workDate, currentPage, currentPageSize);
            // If API returns { items: AssignedProduct[], totalPages: number }
            if (data && typeof data === 'object' && 'items' in data && Array.isArray(data.items)) {
                setAssignedProducts(data.items);
                setTotalPages(data.totalPages ? Number(data.totalPages) : 1);
            } else if (Array.isArray(data)) {
                // Fallback: client-side pagination
                setTotalPages(Math.max(1, Math.ceil(data.length / currentPageSize)));
                setAssignedProducts(data.slice((currentPage - 1) * currentPageSize, currentPage * currentPageSize));
            } else {
                setAssignedProducts([]);
                setTotalPages(1);
            }
        } catch (err) {
            toast.error('Lỗi khi tải danh sách sản phẩm đã phân công');
            setAssignedProducts([]);
            setTotalPages(1);
        } finally {
            setLoading(false);
        }
    }, [page, pageSize]);

    const assignProductsToDate = useCallback(
        async (data: AssignProductsRequest) => {
            setLoading(true);
            try {
                const res = await assignProducts(data);
                toast.success('Phân công sản phẩm thành công');
                return res;
            } catch (err) {
                toast.error('Lỗi khi phân công sản phẩm');
                return null;
            } finally {
                setLoading(false);
            }
        },
        []
    );

    const value: AssignProductContextType = {
        assignedProducts,
        loading,
        fetchAssignedProducts,
        assignProductsToDate,
        page,
        setPage,
        totalPages,
        pageSize
    };

    return (
        <AssignProductContext.Provider value={value}>
            {children}
        </AssignProductContext.Provider>
    );
};

export const useAssignProductContext = (): AssignProductContextType => {
    const ctx = useContext(AssignProductContext);
    if (!ctx)
        throw new Error(
            'useAssignProductContext must be used within AssignProductProvider'
        );
    return ctx;
};
