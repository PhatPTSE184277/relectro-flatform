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
} from '@/services/small-collector/CollectionRouteService';
import type { CollectionRoute } from '@/types/CollectionRoute';
import { useAuth } from '@/hooks/useAuth';

interface CollectionRouteContextType {
    routes: CollectionRoute[];
    loading: boolean;
    fetchRoutes: (pickUpDate?: string) => Promise<void>;
    selectedDate: string;
    setSelectedDate: (date: string) => void;
    routeDetail: CollectionRoute | null;
    fetchRouteDetail: (id: string) => Promise<void>;
    totalPages: number;
    totalItems: number;
    currentPage: number;
    setCurrentPage: (page: number) => void;
    filterStatus: string;
    setFilterStatus: (status: string) => void;
    allStats: {
        total: number;
        notStarted: number;
        inProgress: number;
        completed: number;
        cancelled: number;
    };
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
    const { user } = useAuth();
    const [routes, setRoutes] = useState<CollectionRoute[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [selectedDate, setSelectedDate] = useState<string>(() => {
        const today = new Date();
        return today.toISOString().slice(0, 10);
    });
    const [routeDetail, setRouteDetail] = useState<CollectionRoute | null>(null);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [filterStatus, setFilterStatus] = useState<string>('Chưa bắt đầu');
    const [allStats, setAllStats] = useState({
        total: 0,
        notStarted: 0,
        inProgress: 0,
        completed: 0,
        cancelled: 0
    });

    // fetchRoutes truyền pickUpDate là string
    const fetchRoutes = useCallback(async (pickUpDate?: string) => {
        if (!user?.smallCollectionPointId) {
            console.warn('No smallCollectionPointId found in user profile');
            return;
        }
        setLoading(true);
        try {
            const dateToUse = pickUpDate || selectedDate;
            const response = await getCollectionRoutesByDate({
                page: currentPage,
                limit: 10,
                collectionPointId: user.smallCollectionPointId,
                pickUpDate: dateToUse,
                status: filterStatus || undefined
            });

            // Chuẩn hóa status
            const normalized = Array.isArray(response.data)
                ? response.data.map((route: CollectionRoute) => ({ ...route, status: normalizeStatus(route.status) }))
                : [];
            setRoutes(normalized);
            setTotalPages(response.totalPages || 1);
            setTotalItems(response.totalItems || 0);

            // Fetch stats cho tất cả status
            const fetchAllStats = async () => {
                try {
                    const [allRes, notStartedRes, inProgressRes, completedRes, cancelledRes] = await Promise.all([
                        getCollectionRoutesByDate({ page: 1, limit: 1, collectionPointId: user.smallCollectionPointId, pickUpDate: dateToUse }),
                        getCollectionRoutesByDate({ page: 1, limit: 1, collectionPointId: user.smallCollectionPointId, pickUpDate: dateToUse, status: 'Chưa bắt đầu' }),
                        getCollectionRoutesByDate({ page: 1, limit: 1, collectionPointId: user.smallCollectionPointId, pickUpDate: dateToUse, status: 'Đang tiến hành' }),
                        getCollectionRoutesByDate({ page: 1, limit: 1, collectionPointId: user.smallCollectionPointId, pickUpDate: dateToUse, status: 'Hoàn thành' }),
                        getCollectionRoutesByDate({ page: 1, limit: 1, collectionPointId: user.smallCollectionPointId, pickUpDate: dateToUse, status: 'Hủy bỏ' })
                    ]);

                    setAllStats({
                        total: allRes.totalItems || 0,
                        notStarted: notStartedRes.totalItems || 0,
                        inProgress: inProgressRes.totalItems || 0,
                        completed: completedRes.totalItems || 0,
                        cancelled: cancelledRes.totalItems || 0
                    });
                } catch {
                    // Ignore errors
                }
            };

            void fetchAllStats();
        } catch (err) {
            console.error('fetchRoutes error', err);
            // ...existing code...
            setRoutes([]);
            setTotalPages(1);
            setTotalItems(0);
        } finally {
            setLoading(false);
        }
    }, [selectedDate, currentPage, filterStatus, user?.smallCollectionPointId]);

    const fetchRouteDetail = useCallback(async (id: string) => {
        setLoading(true);
        try {
            const data = await getCollectionRouteDetail(id);
            if (data) {
                data.status = normalizeStatus(data.status);
            }
            setRouteDetail(data || null);
        } catch {
            setRouteDetail(null);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        void fetchRoutes();
    }, [selectedDate, currentPage, filterStatus, fetchRoutes]);

    const value: CollectionRouteContextType = {
        routes,
        loading,
        fetchRoutes,
        selectedDate,
        setSelectedDate,
        routeDetail,
        fetchRouteDetail,
        totalPages,
        totalItems,
        currentPage,
        setCurrentPage,
        filterStatus,
        setFilterStatus,
        allStats,
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