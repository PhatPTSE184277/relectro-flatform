'use client';

import React, {
    createContext,
    useContext,
    useState,
    useCallback,
    useRef,
    ReactNode
} from 'react';
import {
    getCollectionCompaniesFilter,
    getCollectionCompanyById,
    importCollectionCompaniesFromExcel,
    CollectionCompany,
    PaginatedCollectionCompany
} from '@/services/admin/CollectionCompanyService';
import { useAuth } from '@/hooks/useAuth';

// Định nghĩa kiểu context cho công ty thu gom (có phân trang)
interface CollectionCompanyContextType {
    companies: CollectionCompany[];
    loading: boolean;
    error: string | null;
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
    status: string;
    fetchCompanies: (page?: number, limit?: number, status?: string) => Promise<void>;
    fetchCompanyById: (id: string | number) => Promise<CollectionCompany | null>;
    importFromExcel: (file: File) => Promise<any>;
    clearCompanies: () => void;
    setPage: (page: number) => void;
    setLimit: (limit: number) => void;
    setStatus: (status: string) => void;
}

const CollectionCompanyContext = createContext<
    CollectionCompanyContextType | undefined
>(undefined);

type Props = { children: ReactNode };

export const CollectionCompanyProvider: React.FC<Props> = ({ children }) => {
    const { user } = useAuth();
    const [companies, setCompanies] = useState<CollectionCompany[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    // Thêm state cho phân trang
    const [page, setPage] = useState<number>(1);
    const [limit, setLimit] = useState<number>(10);
    const [totalItems, setTotalItems] = useState<number>(0);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [status, setStatus] = useState<string>('');

    // Dùng ref để tránh fetchCompanies phụ thuộc vào state, ngăn re-render không cần thiết
    const pageRef = useRef(page);
    const limitRef = useRef(limit);
    const statusRef = useRef(status);
    const userRef = useRef(user);

    // Đồng bộ ref với state
    pageRef.current = page;
    limitRef.current = limit;
    statusRef.current = status;
    userRef.current = user;

    // Hàm lấy danh sách công ty thu gom có phân trang và filter
    const fetchCompanies = useCallback(async (customPage?: number, customLimit?: number, customStatus?: string) => {
        setLoading(true);
        setError(null);
        try {
            const currentPage = customPage ?? pageRef.current;
            const currentLimit = customLimit ?? limitRef.current;
            const currentStatus = customStatus ?? statusRef.current;
            const currentUser = userRef.current;
            const data: PaginatedCollectionCompany = await getCollectionCompaniesFilter(currentPage, currentLimit, currentStatus || undefined);

            // Nếu là Collector, chỉ lấy công ty của mình
            if (currentUser?.role === 'Collector' && currentUser?.collectionCompanyId) {
                const filteredData = data.data.filter(
                    (company) => String(company.id) === String(currentUser.collectionCompanyId)
                );
                setCompanies(filteredData);
                setTotalItems(filteredData.length);
                setTotalPages(1);
            } else {
                setCompanies(data.data);
                setTotalItems(data.totalItems);
                setTotalPages(data.totalPages);
            }
            setPage(currentPage);
            setLimit(currentLimit);
            if (customStatus !== undefined) setStatus(customStatus);
        } catch (err: any) {
            setError(
                err?.response?.data?.message ||
                    'Lỗi khi tải danh sách công ty thu gom'
            );
            setCompanies([]);
            setTotalItems(0);
            setTotalPages(1);
        } finally {
            setLoading(false);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchCompanyById = useCallback(async (id: string | number) => {
        // Dùng loading riêng để không ảnh hưởng đến loading của danh sách
        setError(null);
        try {
            const data = await getCollectionCompanyById(String(id));
            return data;
        } catch (err: any) {
            setError(
                err?.response?.data?.message || 'Lỗi khi tải chi tiết công ty'
            );
            return null;
        }
    }, []);

    const importFromExcel = useCallback(
        async (file: File) => {
            setLoading(true);
            setError(null);
            try {
                const res = await importCollectionCompaniesFromExcel(file);
                await fetchCompanies();
                return res;
            } catch (err: any) {
                setError(err?.response?.data?.message || 'Lỗi khi import file');
                return null;
            } finally {
                setLoading(false);
            }
        },
        [fetchCompanies]
    );

    const clearCompanies = useCallback(() => {
        setCompanies([]);
        setError(null);
    }, []);

    // Giá trị context trả về
    const value: CollectionCompanyContextType = {
        companies,
        loading,
        error,
        page,
        limit,
        totalItems,
        totalPages,
        status,
        fetchCompanies,
        fetchCompanyById,
        importFromExcel,
        clearCompanies,
        setPage,
        setLimit,
        setStatus
    };

    return (
        <CollectionCompanyContext.Provider value={value}>
            {children}
        </CollectionCompanyContext.Provider>
    );
};

export const useCollectionCompanyContext = (): CollectionCompanyContextType => {
    const ctx = useContext(CollectionCompanyContext);
    if (!ctx)
        throw new Error(
            'useCollectionCompanyContext must be used within CollectionCompanyProvider'
        );
    return ctx;
};
