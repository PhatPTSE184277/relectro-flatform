"use client";

import React, {
    createContext,
    useContext,
    useState,
    useCallback,
    useEffect,
    ReactNode,
} from 'react';
import {
    filterSpeeds,
    getSpeedBySmallPointId,
    updateSpeed,
    createSpeed,
    SpeedData,
    FilterSpeedsResponse,
    CreateSpeedPayload,
} from '@/services/admin/SpeedService';
import { useAuth } from '@/hooks/useAuth';

interface SpeedContextType {
    speeds: SpeedData[];
    loading: boolean;
    error: string | null;
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
    search: string;
    fetchSpeeds: (page?: number, limit?: number, search?: string) => Promise<void>;
    fetchSpeedBySmallPointId: (id: string) => Promise<any>;
    updateSpeedByPayload: (payload: CreateSpeedPayload) => Promise<any>;
    createSpeedByPayload: (payload: CreateSpeedPayload) => Promise<any>;
    clearSpeeds: () => void;
    setPage: (page: number) => void;
    setLimit: (limit: number) => void;
    setSearch: (search: string) => void;
}

const SpeedContext = createContext<SpeedContextType | undefined>(undefined);

type Props = { children: ReactNode };

export const SpeedProvider: React.FC<Props> = ({ children }) => {
    const { user } = useAuth();
    const [speeds, setSpeeds] = useState<SpeedData[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState<number>(1);
    const [limit, setLimit] = useState<number>(10);
    const [totalItems, setTotalItems] = useState<number>(0);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [search, setSearch] = useState<string>('');

    const fetchSpeeds = useCallback(
        async (customPage?: number, customLimit?: number, customSearch?: string) => {
            setLoading(true);
            setError(null);
            try {
                const currentPage = customPage ?? page;
                const currentLimit = customLimit ?? limit;
                const currentSearch = customSearch ?? search;
                const data: FilterSpeedsResponse = await filterSpeeds({
                    page: currentPage,
                    limit: currentLimit,
                    search: currentSearch || undefined,
                });

                // If there is role-based filtering needed in future, handle here using `user`.
                setSpeeds(data.data);
                setTotalItems(data.totalItems);
                setTotalPages(data.totalPages);
                setPage(currentPage);
                setLimit(currentLimit);
                if (customSearch !== undefined) setSearch(customSearch);
            } catch (err: any) {
                setError(err?.response?.data?.message || 'Lỗi khi tải danh sách tốc độ');
                setSpeeds([]);
                setTotalItems(0);
                setTotalPages(1);
            } finally {
                setLoading(false);
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [page, limit, search, user]
    );

    const fetchSpeedBySmallPointId = useCallback(async (id: string) => {
        setLoading(true);
        setError(null);
        try {
            const data = await getSpeedBySmallPointId(id);
            return data;
        } catch (err: any) {
            setError(err?.response?.data?.message || 'Lỗi khi tải tốc độ theo điểm thu gom');
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    const updateSpeedByPayload = useCallback(async (payload: CreateSpeedPayload) => {
        setLoading(true);
        setError(null);
        try {
            const res = await updateSpeed(payload);
            // refresh current list after update
            void fetchSpeeds(page, limit, search);
            return res;
        } catch (err: any) {
            setError(err?.response?.data?.message || 'Lỗi khi cập nhật tốc độ');
            return null;
        } finally {
            setLoading(false);
        }
    }, [fetchSpeeds, page, limit, search]);

    const createSpeedByPayload = useCallback(async (payload: CreateSpeedPayload) => {
        setLoading(true);
        setError(null);
        try {
            const res = await createSpeed(payload);
            // refresh current list after create
            void fetchSpeeds(page, limit, search);
            return res;
        } catch (err: any) {
            setError(err?.response?.data?.message || 'Lỗi khi tạo tốc độ');
            return null;
        } finally {
            setLoading(false);
        }
    }, [fetchSpeeds, page, limit, search]);

    const clearSpeeds = useCallback(() => {
        setSpeeds([]);
        setError(null);
    }, []);

    useEffect(() => {
        void fetchSpeeds();
    }, [fetchSpeeds]);

    const value: SpeedContextType = {
        speeds,
        loading,
        error,
        page,
        limit,
        totalItems,
        totalPages,
        search,
        fetchSpeeds,
        fetchSpeedBySmallPointId,
        updateSpeedByPayload,
        createSpeedByPayload,
        clearSpeeds,
        setPage,
        setLimit,
        setSearch,
    };

    return <SpeedContext.Provider value={value}>{children}</SpeedContext.Provider>;
};

export const useSpeedContext = (): SpeedContextType => {
    const ctx = useContext(SpeedContext);
    if (!ctx) throw new Error('useSpeedContext must be used within SpeedProvider');
    return ctx;
};

export default SpeedProvider;
