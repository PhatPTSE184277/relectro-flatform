'use client';

import React, {
    createContext,
    useState,
    useCallback,
    useContext,
    useEffect,
    ReactNode
} from 'react';
import {
    getCollectionRoutesByDate,
    getCollectionRouteDetail
} from '@/services/colector/CollectionRouteService';
import { toast } from 'react-toastify';
import type { CollectionRoute } from '@/types/CollectionRoute';

interface CollectionRouteContextType {
    routes: CollectionRoute[];
    loading: boolean;
    fetchRoutes: (date: string) => Promise<void>;
    selectedDate: string;
    setSelectedDate: (date: string) => void;
    routeDetail: CollectionRoute | null;
    fetchRouteDetail: (id: string) => Promise<void>;
}

const CollectionRouteContext = createContext<CollectionRouteContextType | undefined>(undefined);

type Props = { children: ReactNode };

// Chuẩn hóa status từ API
function normalizeStatus(status: string = ""): string {
    const s = status.trim().toLowerCase();
    if (s === "đang tiến hành" || s === "collecting" || s === "đang thu gom" || s === "in progress") return "Đang tiến hành";
    if (s === "chưa bắt đầu" || s === "not started") return "Chưa bắt đầu";
    if (s === "đã hoàn thành" || s === "completed" || s === "hoàn thành") return "Hoàn thành";
    if (s === "hủy bỏ" || s === "cancelled" || s === "canceled") return "Hủy bỏ";
    return status;
}

export const CollectionRouteProvider: React.FC<Props> = ({ children }) => {
    const [routes, setRoutes] = useState<CollectionRoute[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [selectedDate, setSelectedDate] = useState<string>(() => {
        const today = new Date();
        return today.toISOString().slice(0, 10);
    });
    const [routeDetail, setRouteDetail] = useState<CollectionRoute | null>(null);

    const fetchRoutes = useCallback(async (date: string) => {
        setLoading(true);
        try {
            const data = await getCollectionRoutesByDate(date);
            // Chuẩn hóa status
            const normalized = Array.isArray(data) 
                ? data.map(route => ({ ...route, status: normalizeStatus(route.status) }))
                : [];
            setRoutes(normalized);
        } catch (err) {
            toast.error('Lỗi khi tải tuyến thu gom');
            setRoutes([]);
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchRouteDetail = useCallback(async (id: string) => {
        setLoading(true);
        try {
            const data = await getCollectionRouteDetail(id);
            if (data) {
                data.status = normalizeStatus(data.status);
            }
            setRouteDetail(data || null);
        } catch (err) {
            toast.error('Lỗi khi tải chi tiết tuyến thu gom');
            setRouteDetail(null);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        void fetchRoutes(selectedDate);
    }, [selectedDate, fetchRoutes]);

    const value: CollectionRouteContextType = {
        routes,
        loading,
        fetchRoutes,
        selectedDate,
        setSelectedDate,
        routeDetail,
        fetchRouteDetail,
    };

    return (
        <CollectionRouteContext.Provider value={value}>
            {children}
        </CollectionRouteContext.Provider>
    );
};

export const useCollectionRouteContext = (): CollectionRouteContextType => {
    const ctx = useContext(CollectionRouteContext);
    if (!ctx)
        throw new Error('useCollectionRouteContext must be used within CollectionRouteProvider');
    return ctx;
};

export default CollectionRouteContext;