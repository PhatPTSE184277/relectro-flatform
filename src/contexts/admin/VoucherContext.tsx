'use client';

import React, {
    createContext,
    useCallback,
    useContext,
    useRef,
    useState,
    ReactNode
} from 'react';
import {
    getVouchersPaged,
    getVoucherById,
    createVoucher,
    activateVoucher as activateVoucherApi,
    deactivateVoucher as deactivateVoucherApi,
    VoucherPagedParams,
    PagedResponse
} from '@/services/admin/VoucherService';

interface VoucherContextType {
    vouchers: any[];
    loading: boolean;
    actionLoading: boolean;
    creating: boolean;
    error: string | null;
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
    status: string;
    stats: {
        total: number;
        active: number;
        inactive: number;
    };
    fetchVouchers: (page?: number, limit?: number, status?: string) => Promise<void>;
    fetchVoucherById: (id: string | number) => Promise<any | null>;
    createVoucherItem: (payload: any) => Promise<any | null>;
    importFromExcel: (file: File) => Promise<any>;
    activateVoucher: (voucherId: string) => Promise<void>;
    deactivateVoucher: (voucherId: string) => Promise<void>;
    clearVouchers: () => void;
    setPage: (page: number) => void;
    setLimit: (limit: number) => void;
    setStatus: (status: string) => void;
}

const VoucherContext = createContext<VoucherContextType | undefined>(undefined);

type Props = { children: ReactNode };

export const VoucherProvider: React.FC<Props> = ({ children }) => {
    const [vouchers, setVouchers] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);
    const [creating, setCreating] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState<number>(1);
    const [limit, setLimit] = useState<number>(10);
    const [totalItems, setTotalItems] = useState<number>(0);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [status, setStatus] = useState<string>('Hoạt động');
    const [stats, setStats] = useState({ total: 0, active: 0, inactive: 0 });

    const pageRef = useRef(page);
    const limitRef = useRef(limit);
    const statusRef = useRef(status);

    pageRef.current = page;
    limitRef.current = limit;
    statusRef.current = status;

    const fetchVoucherStats = useCallback(async () => {
        try {
            const [allRes, activeRes, inactiveRes] = await Promise.all([
                getVouchersPaged({ page: 1, limit: 1 }),
                getVouchersPaged({ page: 1, limit: 1, status: 'Hoạt động' }),
                getVouchersPaged({ page: 1, limit: 1, status: 'Không hoạt động' }),
            ]);

            setStats({
                total: allRes?.totalItems ?? 0,
                active: activeRes?.totalItems ?? 0,
                inactive: inactiveRes?.totalItems ?? 0,
            });
        } catch {
            // ignore stats errors
        }
    }, []);

    const fetchVouchers = useCallback(async (customPage?: number, customLimit?: number, customStatus?: string) => {
        setLoading(true);
        setError(null);
        try {
            const currentPage = customPage ?? pageRef.current;
            const currentLimit = customLimit ?? limitRef.current;
            const currentStatus = customStatus ?? statusRef.current;

            const params: VoucherPagedParams = {
                page: currentPage,
                limit: currentLimit,
                status: currentStatus || undefined
            };

            const data: PagedResponse<any> = await getVouchersPaged(params);
            setVouchers(data?.data ?? []);
            setTotalItems(data?.totalItems ?? 0);
            setTotalPages(data?.totalPages ?? 1);
            setPage(data?.page ?? currentPage);
            setLimit(data?.limit ?? currentLimit);
            if (customStatus !== undefined) setStatus(customStatus);

            if (currentPage === 1 || customStatus !== undefined) {
                void fetchVoucherStats();
            }
        } catch (err: any) {
            setError(err?.response?.data?.message || 'Lỗi khi tải danh sách voucher');
            setVouchers([]);
            setTotalItems(0);
            setTotalPages(1);
        } finally {
            setLoading(false);
        }
    }, [fetchVoucherStats]);

    const fetchVoucherById = useCallback(async (id: string | number) => {
        setError(null);
        try {
            const data = await getVoucherById(String(id));
            return data;
        } catch (err: any) {
            setError(err?.response?.data?.message || 'Lỗi khi tải chi tiết voucher');
            return null;
        }
    }, []);

    const createVoucherItem = useCallback(async (payload: any) => {
        setCreating(true);
        setError(null);
        try {
            const data = await createVoucher(payload);
            await fetchVouchers(pageRef.current, limitRef.current, statusRef.current);
            return data;
        } catch (err: any) {
            setError(err?.response?.data?.message || 'Lỗi khi tạo voucher');
            return null;
        } finally {
            setCreating(false);
        }
    }, [fetchVouchers]);

    const importFromExcel = useCallback(async (file: File) => {
        try {
            const { importVouchersFromExcel } = await import('@/services/admin/VoucherService');
            const res = await importVouchersFromExcel(file);
            if (res) {
                await fetchVouchers(pageRef.current, limitRef.current, statusRef.current);
                return res;
            }
            return null;
        } catch (error) {
            return null;
        }
    }, [fetchVouchers]);

    const activateVoucher = useCallback(async (voucherId: string) => {
        setActionLoading(true);
        setError(null);
        try {
            await activateVoucherApi(voucherId);
            await fetchVouchers(pageRef.current, limitRef.current, statusRef.current);
            void fetchVoucherStats();
        } catch (err: any) {
            setError(err?.response?.data?.message || 'Lỗi khi mở khóa voucher');
            throw err;
        } finally {
            setActionLoading(false);
        }
    }, [fetchVouchers, fetchVoucherStats]);

    const deactivateVoucher = useCallback(async (voucherId: string) => {
        setActionLoading(true);
        setError(null);
        try {
            await deactivateVoucherApi(voucherId);
            await fetchVouchers(pageRef.current, limitRef.current, statusRef.current);
            void fetchVoucherStats();
        } catch (err: any) {
            setError(err?.response?.data?.message || 'Lỗi khi khóa voucher');
            throw err;
        } finally {
            setActionLoading(false);
        }
    }, [fetchVouchers, fetchVoucherStats]);

    const clearVouchers = useCallback(() => {
        setVouchers([]);
        setError(null);
        setStats({ total: 0, active: 0, inactive: 0 });
    }, []);

    const value: VoucherContextType = {
        vouchers,
        loading,
        actionLoading,
        creating,
        error,
        page,
        limit,
        totalItems,
        totalPages,
        status,
        stats,
        fetchVouchers,
        fetchVoucherById,
        createVoucherItem,
        importFromExcel,
        activateVoucher,
        deactivateVoucher,
        clearVouchers,
        setPage,
        setLimit,
        setStatus
    };

    return <VoucherContext.Provider value={value}>{children}</VoucherContext.Provider>;
};

export const useVoucherContext = (): VoucherContextType => {
    const ctx = useContext(VoucherContext);
    if (!ctx) {
        throw new Error('useVoucherContext must be used within VoucherProvider');
    }
    return ctx;
};
