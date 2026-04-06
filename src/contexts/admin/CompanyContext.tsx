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
    getCompaniesFilter,
    getCompanyById,
    importCompaniesFromExcel,
    Company,
    PaginatedCompany
} from '@/services/admin/CompanyService';
import { useAuth } from '@/hooks/useAuth';

// Định nghĩa kiểu context cho công ty thu gom (có phân trang)
interface CompanyContextType {
    companies: Company[];
    loading: boolean;
    error: string | null;
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
    type: string;
    status: string;
    fetchCompanies: (page?: number, limit?: number, type?: string, status?: string) => Promise<void>;
    fetchCompanyById: (id: string | number) => Promise<Company | null>;
    importFromExcel: (file: File) => Promise<any>;
    clearCompanies: () => void;
    setPage: (page: number) => void;
    setLimit: (limit: number) => void;
    setType: (type: string) => void;
    setStatus: (status: string) => void;
}

const CompanyContext = createContext<
    CompanyContextType | undefined
>(undefined);

type Props = { children: ReactNode };

export const CompanyProvider: React.FC<Props> = ({ children }) => {
    const { user } = useAuth();
    const [companies, setCompanies] = useState<Company[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    // Thêm state cho phân trang
    const [page, setPage] = useState<number>(1);
    const [limit, setLimit] = useState<number>(10);
    const [totalItems, setTotalItems] = useState<number>(0);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [type, setType] = useState<string>('');
    const [status, setStatus] = useState<string>('');

    // Dùng ref để tránh fetchCompanies phụ thuộc vào state, ngăn re-render không cần thiết
    const pageRef = useRef(page);
    const limitRef = useRef(limit);
    const typeRef = useRef(type);
    const statusRef = useRef(status);
    const userRef = useRef(user);

    // Đồng bộ ref với state
    pageRef.current = page;
    limitRef.current = limit;
    typeRef.current = type;
    statusRef.current = status;
    userRef.current = user;

    // Hàm lấy danh sách công ty thu gom có phân trang và filter
    const fetchCompanies = useCallback(async (customPage?: number, customLimit?: number, customType?: string, customStatus?: string) => {
        setLoading(true);
        setError(null);
        try {
            const currentPage = customPage ?? pageRef.current;
            const currentLimit = customLimit ?? limitRef.current;
            // Force API to always receive 'Công ty tái chế' as requested
            const currentType = 'Công ty tái chế';
            const currentStatus = customStatus ?? statusRef.current;
            const currentUser = userRef.current;
            const data: PaginatedCompany = await getCompaniesFilter(currentPage, currentLimit, currentType || undefined, currentStatus || undefined);

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
            if (customType !== undefined) setType(customType);
            if (customStatus !== undefined) setStatus(customStatus);
        } catch (err: any) {
            setError(
                err?.response?.data?.message ||
                    'Lỗi khi tải danh sách công ty'
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
            const data = await getCompanyById(String(id));
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
                const res = await importCompaniesFromExcel(file);
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
    const value: CompanyContextType = {
        companies,
        loading,
        error,
        page,
        limit,
        totalItems,
        totalPages,
        type,
        status,
        fetchCompanies,
        fetchCompanyById,
        importFromExcel,
        clearCompanies,
        setPage,
        setLimit,
        setType,
        setStatus
    };

    return (
        <CompanyContext.Provider value={value}>
            {children}
        </CompanyContext.Provider>
    );
};

export const useCompanyContext = (): CompanyContextType => {
    const ctx = useContext(CompanyContext);
    if (!ctx)
        throw new Error(
            'useCompanyContext must be used within CompanyProvider'
        );
    return ctx;
};

// Backwards-compatible aliases (do not remove immediately)
export const useCollectionCompanyContext = useCompanyContext;
export const CollectionCompanyProvider = CompanyProvider;
export type CollectionCompanyContextType = CompanyContextType;
