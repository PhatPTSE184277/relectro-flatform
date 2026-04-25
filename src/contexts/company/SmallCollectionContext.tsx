'use client';

import React, {
    createContext,
    useContext,
    useState,
    useCallback,
    ReactNode
} from 'react';
import {
    getSmallCollectionsFilter,
    getSmallCollectionPointById,
    importSmallCollectionExcel
} from '@/services/company/SmallCollectionService';
import { SmallCollectionPoint } from '@/types';

interface PageInfo {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
}

interface SmallCollectionContextType {
    loading: boolean;
    error: string | null;
    smallCollections: SmallCollectionPoint[];
    selectedSmallCollection: SmallCollectionPoint | null;
    pageInfo: PageInfo | null;
    fetchSmallCollections: (params?: any) => Promise<void>;
    fetchSmallCollectionById: (id: number | string) => Promise<SmallCollectionPoint | null>;
    importSmallCollection: (file: File) => Promise<any>;
    clearSmallCollections: () => void;
}

const SmallCollectionContext = createContext<
    SmallCollectionContextType | undefined
>(undefined);

export const SmallCollectionProvider = ({
    children
}: {
    children: ReactNode;
}) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [smallCollections, setSmallCollections] = useState<
        SmallCollectionPoint[]
    >([]);
    const [selectedSmallCollection, setSelectedSmallCollection] =
        useState<SmallCollectionPoint | null>(null);
    const [pageInfo, setPageInfo] = useState<PageInfo | null>(null);
    const [, setDetailLoading] = useState(false);

    const fetchSmallCollections = useCallback(async (params?: any) => {
        setLoading(true);
        setError(null);
        try {
            const res = await getSmallCollectionsFilter(params || {});
            setSmallCollections(res.data || []);
            setPageInfo({
                page: res.page,
                limit: res.limit,
                totalItems: res.totalItems,
                totalPages: res.totalPages
            });
        } catch (err: any) {
            setError(
                err?.response?.data?.message ||
                    'Lỗi khi tải danh sách điểm thu gom nhỏ'
            );
            setSmallCollections([]);
            setPageInfo(null);
        } finally {
            setLoading(false);
        }
    }, []);

    // Auto-fetch removed: fetchSmallCollections should be called on demand

    const fetchSmallCollectionById = useCallback(async (id: number | string) => {
        setDetailLoading(true);
        setError(null);
        try {
            const res = await getSmallCollectionPointById(id);
            setSelectedSmallCollection(res);
            return res;
        } catch (err: any) {
            setError(
                err?.response?.data?.message ||
                    'Lỗi khi tải chi tiết điểm thu gom nhỏ'
            );
            setSelectedSmallCollection(null);
            return null;
        } finally {
            setDetailLoading(false);
        }
    }, []);

    const importSmallCollection = useCallback(async (file: File) => {
        setLoading(true);
        setError(null);
        try {
            const res = await importSmallCollectionExcel(file);
            return res;
        } catch (err: any) {
            setError(err?.response?.data?.message || 'Lỗi khi import file');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const clearSmallCollections = useCallback(() => {
        setSmallCollections([]);
        setSelectedSmallCollection(null);
        setPageInfo(null);
        setError(null);
    }, []);

    return (
        <SmallCollectionContext.Provider
            value={{
                loading,
                error,
                smallCollections,
                selectedSmallCollection,
                pageInfo,
                fetchSmallCollections,
                fetchSmallCollectionById,
                importSmallCollection,
                clearSmallCollections
            }}
        >
            {children}
        </SmallCollectionContext.Provider>
    );
};

export const useSmallCollectionContext = () => {
    const context = useContext(SmallCollectionContext);
    if (!context)
        throw new Error(
            'useSmallCollectionContext must be used within SmallCollectionProvider'
        );
    return context;
};
