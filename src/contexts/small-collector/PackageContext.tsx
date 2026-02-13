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
    filterPackages,
    getPackageById,
    createPackage,
    updatePackage,
    updatePackageStatus,
    deliverPackage,
    deliverPackages,
    sendPackageToRecycler,
} from '@/services/small-collector/PackageService';
import {
    PackageType,
    FilterPackagesResponse,
    CreatePackagePayload,
    UpdatePackagePayload
} from '@/types/Package';
import { useAuth } from '@/redux';

interface PackageFilter {
    page?: number;
    limit?: number;
    smallCollectionPointId?: string;
    status?: string;
}

interface PackageContextType {
    packages: PackageType[];
    loadingList: boolean;
    loadingDetail: boolean;
    selectedPackage: PackageType | null;
    setSelectedPackage: (pkg: PackageType | null) => void;
    fetchPackages: (customFilter?: Partial<PackageFilter>) => Promise<void>;
    fetchPackageDetail: (packageId: string, page?: number, limit?: number) => Promise<void>;
    createNewPackage: (payload: CreatePackagePayload) => Promise<void>;
    updateExistingPackage: (packageId: string, payload: UpdatePackagePayload) => Promise<void>;
    updateStatus: (packageId: string) => Promise<void>;
    filter: PackageFilter;
    setFilter: (filter: Partial<PackageFilter>) => void;
    totalPages: number;
    totalItems: number;
    allStats: {
        total: number;
        packing: number;
        shipping: number;
        closed: number;
    };
    handleDeliverPackage: (packageId: string) => Promise<void>;
    handleDeliverPackages: (packageIds: string[]) => Promise<void>;
    handleSendPackageToRecycler: (packageId: string) => Promise<void>;
}

const PackageContext = createContext<PackageContextType | undefined>(undefined);

type Props = { children: ReactNode };

export const PackageProvider: React.FC<Props> = ({ children }) => {
    const { user } = useAuth();
    const [packages, setPackages] = useState<PackageType[]>([]);
    const [loadingList, setLoadingList] = useState<boolean>(false);
    const [loadingDetail, setLoadingDetail] = useState<boolean>(false);
    const [selectedPackage, setSelectedPackage] = useState<PackageType | null>(null);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [allStats, setAllStats] = useState({
        total: 0,
        packing: 0,
        shipping: 0,
        closed: 0
    });


    const [filter, setFilterState] = useState<PackageFilter>({
        page: 1,
        limit: 10,
        smallCollectionPointId: user?.smallCollectionPointId,
        status: 'Đang đóng gói'
    });

    // Cập nhật smallCollectionPointId khi user thay đổi
    useEffect(() => {
        setFilterState((prev) => ({ ...prev, smallCollectionPointId: user?.smallCollectionPointId }));
    }, [user?.smallCollectionPointId]);
    const setFilter = (newFilter: Partial<PackageFilter>) => {
        setFilterState((prev) => ({ ...prev, ...newFilter }));
    };

    const fetchPackages = useCallback(
        async (customFilter?: Partial<PackageFilter>) => {
            if (!user?.smallCollectionPointId) {
                console.warn('No smallCollectionPointId found in user profile');
                return;
            }
            setLoadingList(true);
            try {
                const params: Record<string, any> = {
                    ...filter,
                    ...customFilter
                };
                // Remove undefined values first
                Object.keys(params).forEach(
                    (key) => params[key] === undefined && delete params[key]
                );
                // Ensure smallCollectionPointId is always set from user
                params.smallCollectionPointId = user.smallCollectionPointId;
                
                const response: FilterPackagesResponse = await filterPackages(params);
                setPackages(response.data || []);
                setTotalPages(response.totalPages);
                setTotalItems(response.totalItems);
            } catch (err) {
                console.error('fetchPackages error', err);
                // ...existing code...
                setPackages([]);
            } finally {
                setLoadingList(false);
            }
        },
        [filter, user?.smallCollectionPointId]
    );

    const fetchAllStats = useCallback(async () => {
        try {
            const baseParams = {
                page: 1,
                limit: 1,
                smallCollectionPointId: filter.smallCollectionPointId
            };

            const [totalRes, packingRes, shippingRes, closedRes] = await Promise.all([
                filterPackages(baseParams),
                filterPackages({ ...baseParams, status: 'Đang đóng gói' }),
                filterPackages({ ...baseParams, status: 'Đang vận chuyển' }),
                filterPackages({ ...baseParams, status: 'Đã đóng thùng' })
            ]);

            setAllStats({
                total: totalRes.totalItems,
                packing: packingRes.totalItems,
                shipping: shippingRes.totalItems,
                closed: closedRes.totalItems
            });
        } catch (err) {
            console.error('fetchAllStats error', err);
        }
    }, [filter.smallCollectionPointId]);

    const fetchPackageDetail = useCallback(
        async (packageId: string, page: number = 1, limit: number = 10) => {
            setLoadingDetail(true);
            try {
                const pkg = await getPackageById(packageId, page, limit);
                setSelectedPackage(pkg);
            } catch (err) {
                console.error('fetchPackageDetail error', err);
                // ...existing code...
                setSelectedPackage(null);
            } finally {
                setLoadingDetail(false);
            }
        },
        []
    );

    const createNewPackage = useCallback(
        async (payload: CreatePackagePayload) => {
            setLoadingList(true);
            try {
                await createPackage(payload);
                // ...existing code...
                await fetchPackages();
                await fetchAllStats();
            } catch (err: any) {
                console.error('createNewPackage error', err);
                // ...existing code...
                throw err;
            } finally {
                setLoadingList(false);
            }
        },
        [fetchPackages, fetchAllStats]
    );

    const updateExistingPackage = useCallback(
        async (packageId: string, payload: UpdatePackagePayload) => {
            setLoadingList(true);
            try {
                await updatePackage(packageId, payload);
                // ...existing code...
                await fetchPackages();
            } catch (err: any) {
                console.error('updateExistingPackage error', err);
                // ...existing code...
                throw err;
            } finally {
                setLoadingList(false);
            }
        },
        [fetchPackages]
    );

    // Thêm hàm cập nhật trạng thái package
    const updateStatus = useCallback(
        async (packageId: string) => {
            setLoadingList(true);
            try {
                await updatePackageStatus(packageId);
                // ...existing code...
                await fetchPackages();
                await fetchAllStats();
            } catch (err) {
                console.error('updateStatus error', err);
                // ...existing code...
            } finally {
                setLoadingList(false);
            }
        },
        [fetchPackages, fetchAllStats]
    );

    // Hàm cho Shipper: Lấy hàng từ kho để vận chuyển đến nơi tái chế
    const handleDeliverPackage = useCallback(
        async (packageId: string) => {
            setLoadingList(true);
            try {
                await deliverPackage(packageId);
                // ...existing code...
                await fetchPackages();
                await fetchAllStats();
            } catch (err) {
                console.error('handleDeliverPackage error', err);
                // ...existing code...
            } finally {
                setLoadingList(false);
            }
        },
        [fetchPackages, fetchAllStats]
    );

    const handleDeliverPackages = useCallback(
        async (packageIds: string[]) => {
            setLoadingList(true);
            try {
                await deliverPackages(packageIds);
                await fetchPackages();
                await fetchAllStats();
            } catch (err) {
                console.error('handleDeliverPackages error', err);
            } finally {
                setLoadingList(false);
            }
        },
        [fetchPackages, fetchAllStats]
    );

    // Hàm cho Recycler: Xác nhận nhận hàng tại nơi tái chế
    const handleSendPackageToRecycler = useCallback(
        async (packageId: string) => {
            setLoadingList(true);
            try {
                await sendPackageToRecycler(packageId);
                // ...existing code...
                await fetchPackages();
                await fetchAllStats();
            } catch (err) {
                console.error('handleSendPackageToRecycler error', err);
                // ...existing code...
            } finally {
                setLoadingList(false);
            }
        },
        [fetchPackages, fetchAllStats]
    );

    useEffect(() => {
        void fetchPackages();
        void fetchAllStats();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filter]);

    const value: PackageContextType = {
        packages,
        loadingList,
        loadingDetail,
        selectedPackage,
        setSelectedPackage,
        fetchPackages,
        fetchPackageDetail,
        createNewPackage,
        updateExistingPackage,
        updateStatus,
        filter,
        setFilter,
        totalPages,
        totalItems,
        allStats,
        handleDeliverPackage,
        handleDeliverPackages,
        handleSendPackageToRecycler
    };

    return (
        <PackageContext.Provider value={value}>
            {children}
        </PackageContext.Provider>
    );
};

export const usePackageContext = (): PackageContextType => {
    const ctx = useContext(PackageContext);
    if (!ctx)
        throw new Error('usePackageContext must be used within PackageProvider');
    return ctx;
};

export default PackageContext;