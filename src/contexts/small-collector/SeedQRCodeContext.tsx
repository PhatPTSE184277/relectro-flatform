'use client';

import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
    type ReactNode
} from 'react';
import { useAuth } from '@/hooks/useAuth';
import {
    getCollectionRoutesByDate,
    seedProductsWithQRCodes
} from '@/services/small-collector/SeedQRCode';
import type { CollectionRoute } from '@/types/CollectionRoute';

interface SeedQRCodeContextType {
    routes: CollectionRoute[];
    loading: boolean;
    selectedIds: Set<string>;
    pickUpDate: string;
    setPickUpDate: (date: string) => void;
    showModal: boolean;
    setShowModal: (open: boolean) => void;
    toast: { message: string; type: 'success' | 'error' } | null;
    showToast: (message: string, type: 'success' | 'error') => void;
    hideToast: () => void;
    fetchRoutes: () => Promise<void>;
    toggleRoute: (id: string) => void;
    toggleAll: () => void;
    seedQR: (qrCodes: string[]) => Promise<void>;
}

const SeedQRCodeContext = createContext<SeedQRCodeContextType | undefined>(undefined);

type Props = { children: ReactNode };

export const SeedQRCodeProvider: React.FC<Props> = ({ children }) => {
    const { user } = useAuth();
    const collectionPointId = (user as any)?.smallCollectionPointId || '';

    const todayStr = (() => {
        const d = new Date();
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    })();

    const [routes, setRoutes] = useState<CollectionRoute[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [pickUpDate, setPickUpDate] = useState(todayStr);
    const [showModal, setShowModal] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    const showToast = useCallback((message: string, type: 'success' | 'error') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    }, []);

    const hideToast = useCallback(() => setToast(null), []);

    const fetchRoutes = useCallback(async () => {
        if (!collectionPointId) return;
        setLoading(true);
        try {
            const res = await getCollectionRoutesByDate({
                collectionPointId,
                pickUpDate,
                limit: 100,
                status: 'Chưa bắt đầu'
            });
            setRoutes(res.data ?? []);
            setSelectedIds(new Set());
        } catch (err) {
            console.error(err);
            showToast('Không thể tải danh sách tuyến thu gom.', 'error');
        } finally {
            setLoading(false);
        }
    }, [collectionPointId, pickUpDate, showToast]);

    useEffect(() => {
        fetchRoutes();
    }, [fetchRoutes]);

    const toggleRoute = useCallback((id: string) => {
        setSelectedIds(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    }, []);

    const toggleAll = useCallback(() => {
        if (routes.length > 0 && routes.every(r => selectedIds.has(r.collectionRouteId))) {
            setSelectedIds(new Set());
        } else {
            setSelectedIds(new Set(routes.map(r => r.collectionRouteId)));
        }
    }, [routes, selectedIds]);

    const seedQR = useCallback(async (qrCodes: string[]) => {
        const productIds = routes
            .filter(r => selectedIds.has(r.collectionRouteId))
            .map(r => (r as any).productId ?? r.postId)
            .filter(Boolean);

        if (productIds.length === 0) {
            showToast('Chưa chọn tuyến nào.', 'error');
            return;
        }

        await seedProductsWithQRCodes({ productIds, qrCodes });
        setShowModal(false);
        showToast(`Đã gán QR Code cho ${productIds.length} sản phẩm!`, 'success');
        await fetchRoutes();
    }, [routes, selectedIds, showToast, fetchRoutes]);

    return (
        <SeedQRCodeContext.Provider
            value={{
                routes,
                loading,
                selectedIds,
                pickUpDate,
                setPickUpDate,
                showModal,
                setShowModal,
                toast,
                showToast,
                hideToast,
                fetchRoutes,
                toggleRoute,
                toggleAll,
                seedQR
            }}
        >
            {children}
        </SeedQRCodeContext.Provider>
    );
};

export const useSeedQRCodeContext = (): SeedQRCodeContextType => {
    const ctx = useContext(SeedQRCodeContext);
    if (!ctx) throw new Error('useSeedQRCodeContext must be used inside SeedQRCodeProvider');
    return ctx;
};

export default SeedQRCodeContext;
