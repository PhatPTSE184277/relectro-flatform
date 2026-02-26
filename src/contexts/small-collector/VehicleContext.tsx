'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { filterVehicles, getVehicleById, approveVehicle as approveVehicleApi, blockVehicle as blockVehicleApi, VehicleItem, VehicleListPagingResponse } from '@/services/small-collector/VehicleService';
import { useAuth } from '@/hooks/useAuth';

export type VehicleStatusFilter = 'Đang hoạt động' | 'Không hoạt động';

interface VehicleContextType {
    loading: boolean;
    actionLoading: boolean;
    vehicles: VehicleItem[];
    totalItems: number;
    page: number;
    totalPages: number;
    selectedVehicle: VehicleItem | null;
    error: string | null;
    fetchVehicles: (status?: VehicleStatusFilter, pageNum?: number, limit?: number) => Promise<void>;
    fetchVehicleDetail: (id: string) => Promise<void>;
    approveVehicle: (vehicleId: string) => Promise<void>;
    blockVehicle: (vehicleId: string) => Promise<void>;
    setPage: (page: number) => void;
}

const VehicleContext = createContext<VehicleContextType | undefined>(undefined);

export const VehicleProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);
    const [vehicles, setVehicles] = useState<VehicleItem[]>([]);
    const [totalItems, setTotalItems] = useState(0);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedVehicle, setSelectedVehicle] = useState<VehicleItem | null>(null);
    const [error, setError] = useState<string | null>(null);
    const currentStatusRef = React.useRef<VehicleStatusFilter | undefined>(undefined);

    const fetchVehicles = useCallback(async (
        status?: VehicleStatusFilter,
        pageNum: number = 1,
        limit: number = 20
    ) => {
        if (!user?.smallCollectionPointId) return;
        currentStatusRef.current = status;
        setLoading(true);
        setError(null);
        try {
            const data: VehicleListPagingResponse = await filterVehicles({
                smallCollectionPointId: user.smallCollectionPointId,
                status,
                page: pageNum,
                limit,
            });
            setVehicles(data?.data || []);
            setTotalItems(data?.totalItems || 0);
            setTotalPages(data?.totalPages || 1);
            setPage(data?.page || 1);
        } catch (err: any) {
            console.log(err);
            setError(err?.response?.data?.message || 'Lỗi khi tải phương tiện');
            setVehicles([]);
        } finally {
            setLoading(false);
        }
    }, [user?.smallCollectionPointId]);

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
            await fetchVehicles(currentStatusRef.current);
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
            await fetchVehicles(currentStatusRef.current);
        } catch (err: any) {
            setError(err?.response?.data?.message || 'Lỗi khi khóa phương tiện');
        } finally {
            setActionLoading(false);
        }
    }, [fetchVehicles]);

    const value: VehicleContextType = {
        loading,
        actionLoading,
        vehicles,
        totalItems,
        page,
        totalPages,
        selectedVehicle,
        error,
        fetchVehicles,
        fetchVehicleDetail,
        approveVehicle,
        blockVehicle,
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
