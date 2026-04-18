'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { filterVehicles, getVehicleById, approveVehicle as approveVehicleApi, blockVehicle as blockVehicleApi, importVehiclesExcel, VehicleItem, VehicleListPagingResponse } from '@/services/collection-point/VehicleService';
import { useAuth } from '@/hooks/useAuth';

export type VehicleStatusFilter = 'Đang hoạt động' | 'Không hoạt động';

interface VehicleContextType {
    loading: boolean;
    actionLoading: boolean;
    vehicles: VehicleItem[];
    totalItems: number;
    stats: {
        total: number;
        active: number;
        inactive: number;
    };
    page: number;
    totalPages: number;
    selectedVehicle: VehicleItem | null;
    error: string | null;
    fetchVehicles: (
        status?: VehicleStatusFilter,
        pageNum?: number,
        limit?: number,
        plateNumber?: string,
        refreshStats?: boolean
    ) => Promise<void>;
    fetchVehicleDetail: (id: string) => Promise<void>;
    approveVehicle: (vehicleId: string) => Promise<void>;
    blockVehicle: (vehicleId: string) => Promise<void>;
    importVehicles: (file: File) => Promise<any>;
    setPage: (page: number) => void;
}

const VehicleContext = createContext<VehicleContextType | undefined>(undefined);

export const VehicleProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);
    const [vehicles, setVehicles] = useState<VehicleItem[]>([]);
    const [totalItems, setTotalItems] = useState(0);
    const [stats, setStats] = useState({
        total: 0,
        active: 0,
        inactive: 0,
    });
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedVehicle, setSelectedVehicle] = useState<VehicleItem | null>(null);
    const [error, setError] = useState<string | null>(null);
    const currentStatusRef = React.useRef<VehicleStatusFilter | undefined>(undefined);
    const currentPageRef = React.useRef<number>(1);
    const DEFAULT_LIMIT = 10;
    const currentLimitRef = React.useRef<number>(DEFAULT_LIMIT);
    const currentPlateNumberRef = React.useRef<string>('');
    const lastStatsKeyRef = React.useRef<string>('');

    const fetchVehicleStats = useCallback(async (smallCollectionPointId: string, plateNumber: string) => {
        try {
            const [allRes, activeRes, inactiveRes] = await Promise.all([
                filterVehicles({
                    smallCollectionPointId,
                    page: 1,
                    limit: 1,
                    plateNumber,
                }),
                filterVehicles({
                    smallCollectionPointId,
                    status: 'Đang hoạt động',
                    page: 1,
                    limit: 1,
                    plateNumber,
                }),
                filterVehicles({
                    smallCollectionPointId,
                    status: 'Không hoạt động',
                    page: 1,
                    limit: 1,
                    plateNumber,
                }),
            ]);

            setStats({
                total: allRes?.totalItems || 0,
                active: activeRes?.totalItems || 0,
                inactive: inactiveRes?.totalItems || 0,
            });
        } catch {
            // Ignore stats errors to avoid blocking main list
        }
    }, []);

    const fetchVehicles = useCallback(async (
        status?: VehicleStatusFilter,
        pageNum: number = 1,
        limit: number = DEFAULT_LIMIT,
        plateNumber: string = '',
        refreshStats: boolean = false
    ) => {
        if (!user?.smallCollectionPointId) return;
        currentStatusRef.current = status;
        currentPageRef.current = pageNum;
        currentLimitRef.current = limit;
        currentPlateNumberRef.current = plateNumber;
        setLoading(true);
        setError(null);
        try {
            const data: VehicleListPagingResponse = await filterVehicles({
                smallCollectionPointId: user.smallCollectionPointId,
                status,
                page: pageNum,
                limit,
                plateNumber,
            });

            const responseAny = data as any;
            const nextVehicles: VehicleItem[] =
                (data?.data as VehicleItem[] | undefined) ??
                (responseAny?.items as VehicleItem[] | undefined) ??
                [];

            const nextTotalItems: number =
                (data?.totalItems as number | undefined) ??
                (responseAny?.totalItems as number | undefined) ??
                (responseAny?.total as number | undefined) ??
                (responseAny?.totalItem as number | undefined) ??
                0;

            const nextLimit: number =
                (data?.limit as number | undefined) ??
                (responseAny?.limit as number | undefined) ??
                limit;

            const nextPage: number =
                (data?.page as number | undefined) ??
                (responseAny?.page as number | undefined) ??
                pageNum;

            const nextTotalPages: number =
                (data?.totalPages as number | undefined) ??
                (responseAny?.totalPages as number | undefined) ??
                (responseAny?.totalPage as number | undefined) ??
                Math.max(1, Math.ceil(nextTotalItems / Math.max(1, nextLimit)));

            setVehicles(nextVehicles);
            setTotalItems(nextTotalItems);
            setTotalPages(nextTotalPages);
            setPage(nextPage);

            // Fetch stats in background (avoid refetching on page-only changes)
            const statsKey = `${user.smallCollectionPointId}::${plateNumber}`;
            if (refreshStats || lastStatsKeyRef.current !== statsKey) {
                lastStatsKeyRef.current = statsKey;
                void fetchVehicleStats(user.smallCollectionPointId, plateNumber);
            }
        } catch (err: any) {
            console.log(err);
            setError(err?.response?.data?.message || 'Lỗi khi tải phương tiện');
            setVehicles([]);
            setTotalItems(0);
            setTotalPages(1);
        } finally {
            setLoading(false);
        }
    }, [user?.smallCollectionPointId, fetchVehicleStats]);

    const fetchVehicleDetail = useCallback(async (id: string) => {
        setLoading(true);
        setError(null);
        try {
            const data = await getVehicleById(id);
            setSelectedVehicle(data);
        } catch (err: any) {
            setError(err?.response?.data?.message || 'Lỗi khi tải chi tiết phương tiện');
            setSelectedVehicle(null);
        } finally {
            setLoading(false);
        }
    }, []);

    const approveVehicle = useCallback(async (vehicleId: string) => {
        setActionLoading(true);
        setError(null);
        try {
            await approveVehicleApi(vehicleId);
            await fetchVehicles(
                currentStatusRef.current,
                currentPageRef.current,
                currentLimitRef.current,
                currentPlateNumberRef.current,
                true
            );
        } catch (err: any) {
            setError(err?.response?.data?.message || 'Lỗi khi duyệt phương tiện');
        } finally {
            setActionLoading(false);
        }
    }, [fetchVehicles]);

    const blockVehicle = useCallback(async (vehicleId: string) => {
        setActionLoading(true);
        setError(null);
        try {
            await blockVehicleApi(vehicleId);
            await fetchVehicles(
                currentStatusRef.current,
                currentPageRef.current,
                currentLimitRef.current,
                currentPlateNumberRef.current,
                true
            );
        } catch (err: any) {
            setError(err?.response?.data?.message || 'Lỗi khi khóa phương tiện');
        } finally {
            setActionLoading(false);
        }
    }, [fetchVehicles]);

    const importVehicles = useCallback(async (file: File) => {
        setLoading(true);
        setError(null);
        try {
            const result = await importVehiclesExcel(file);
            return result;
        } catch (err: any) {
            setError(err?.response?.data?.message || 'Lỗi khi import phương tiện');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const value: VehicleContextType = {
        loading,
        actionLoading,
        vehicles,
        totalItems,
        stats,
        page,
        totalPages,
        selectedVehicle,
        error,
        fetchVehicles,
        fetchVehicleDetail,
        approveVehicle,
        blockVehicle,
        importVehicles,
        setPage,
    };

    return (
        <VehicleContext.Provider value={value}>
            {children}
        </VehicleContext.Provider>
    );
};

export const useVehicleContext = () => {
    const context = useContext(VehicleContext);
    if (!context) throw new Error('useVehicleContext must be used within VehicleProvider');
    return context;
};
