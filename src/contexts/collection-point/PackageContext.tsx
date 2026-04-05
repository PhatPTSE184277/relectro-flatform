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
    filterTrackingPackages,
    getTrackingPackageDetail,
    createPackage,
    updatePackage,
    updatePackageStatus,
    deliverPackage,
    deliverPackages,
    sendPackageToRecycler,
} from '@/services/collection-point/PackageService';
import {
    PackageType,
    FilterPackagesResponse,
    CreatePackagePayload,
    UpdatePackagePayload
} from '@/types/Package';
import { useAuth } from '@/redux';
import { getFirstDayOfMonthString, getTodayString } from '@/utils/getDayString';

interface PackageFilter {
    page?: number;
    limit?: number;
    smallCollectionPointId?: string;
    status?: string;
    packageId?: string;
    fromDate?: string;
    toDate?: string;
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
        recycled: number;
    };
    handleDeliverPackage: (packageId: string) => Promise<void>;
    handleDeliverPackages: (packageIds: string[], deliveryQrCode: string) => Promise<void>;
    handleSendPackageToRecycler: (packageId: string) => Promise<void>;
}

const PackageContext = createContext<PackageContextType | undefined>(undefined);

type Props = { children: ReactNode };

export const PackageProvider: React.FC<Props> = ({ children }) => {
    const { user } = useAuth();
    const DELIVERED_UI_STATUS = 'Đã giao';
    const SHIPPING_STATUS = 'Đang vận chuyển';
    const RECYCLED_STATUS = 'Tái chế';

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
        closed: 0,
        recycled: 0
    });


    const [filter, setFilterState] = useState<PackageFilter>({
        page: 1,
        limit: 10,
        smallCollectionPointId: user?.smallCollectionPointId,
        status: 'Đang đóng gói',
        fromDate: getFirstDayOfMonthString(),
        toDate: getTodayString(),
        packageId: ''
    });

    // Cập nhật smallCollectionPointId khi user thay đổi
    useEffect(() => {
        setFilterState((prev) => {
            if (prev.smallCollectionPointId === user?.smallCollectionPointId) {
                return prev;
            }

            return { ...prev, smallCollectionPointId: user?.smallCollectionPointId };
        });
    }, [user?.smallCollectionPointId]);
    const setFilter = useCallback((newFilter: Partial<PackageFilter>) => {
        setFilterState((prev) => {
            const merged = { ...prev, ...newFilter };
            const hasChange = Object.keys(newFilter).some((key) => {
                const typedKey = key as keyof PackageFilter;
                return prev[typedKey] !== merged[typedKey];
            });

            return hasChange ? merged : prev;
        });
    }, []);

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
                // Ensure smallCollectionPointId is always set from user
                params.smallCollectionPointId = user.smallCollectionPointId;

                const currentStatus = String(params.status || '');
                const currentPage = Number(params.page || 1);
                const currentLimit = Number(params.limit || 10);

                if (currentStatus !== DELIVERED_UI_STATUS) {
                    delete params.fromDate;
                    delete params.toDate;
                }

                if (currentStatus === DELIVERED_UI_STATUS) {
                    const baseParams: Record<string, any> = {
                        ...params,
                        status: undefined,
                        page: 1,
                        limit: 1
                    };

                    Object.keys(baseParams).forEach((key) => {
                        if (baseParams[key] === undefined || baseParams[key] === null || baseParams[key] === '') {
                            delete baseParams[key];
                        }
                    });

                    const [shippingTotalRes, recycledTotalRes] = await Promise.all([
                        filterTrackingPackages({ ...baseParams, status: SHIPPING_STATUS, page: 1, limit: 1 }),
                        filterTrackingPackages({ ...baseParams, status: RECYCLED_STATUS, page: 1, limit: 1 })
                    ]);

                    const shippingTotal = shippingTotalRes?.totalItems || 0;
                    const recycledTotal = recycledTotalRes?.totalItems || 0;

                    const [shippingDataRes, recycledDataRes] = await Promise.all([
                        shippingTotal > 0
                            ? filterTrackingPackages({ ...baseParams, status: SHIPPING_STATUS, page: 1, limit: shippingTotal })
                            : Promise.resolve({ data: [], totalPages: 1, totalItems: 0, page: 1, limit: 1 }),
                        recycledTotal > 0
                            ? filterTrackingPackages({ ...baseParams, status: RECYCLED_STATUS, page: 1, limit: recycledTotal })
                            : Promise.resolve({ data: [], totalPages: 1, totalItems: 0, page: 1, limit: 1 })
                    ]);

                    const mergedMap = new Map<string, PackageType>();
                    [...(shippingDataRes.data || []), ...(recycledDataRes.data || [])].forEach((item: PackageType) => {
                        const key = String(item?.packageId || '');
                        if (!key) return;
                        mergedMap.set(key, {
                            ...item,
                            status: DELIVERED_UI_STATUS
                        });
                    });

                    const mergedPackages = Array.from(mergedMap.values()).sort((a: PackageType, b: PackageType) => {
                        const timeA = new Date(a?.deliveryAt || 0).getTime();
                        const timeB = new Date(b?.deliveryAt || 0).getTime();
                        return timeB - timeA;
                    });

                    const totalMergedItems = mergedPackages.length;
                    const startIndex = (currentPage - 1) * currentLimit;
                    const endIndex = startIndex + currentLimit;
                    const paginatedMergedPackages = mergedPackages.slice(startIndex, endIndex);

                    setPackages(paginatedMergedPackages);
                    setTotalPages(Math.max(1, Math.ceil(totalMergedItems / currentLimit)));
                    setTotalItems(totalMergedItems);
                    return;
                }

                // Remove undefined values first
                Object.keys(params).forEach((key) => {
                    if (params[key] === undefined || params[key] === null || params[key] === '') {
                        delete params[key];
                    }
                });
                
                const response: FilterPackagesResponse = await filterTrackingPackages(params);
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
                smallCollectionPointId: filter.smallCollectionPointId,
                packageId: filter.packageId
            };

            const deliveredDateParams = {
                fromDate: filter.fromDate,
                toDate: filter.toDate
            };

            const [totalRes, packingRes, closedRes, shippingRes, recycledRes] = await Promise.all([
                filterTrackingPackages(baseParams),
                filterTrackingPackages({ ...baseParams, status: 'Đang đóng gói' }),
                filterTrackingPackages({ ...baseParams, status: 'Đã đóng thùng' }),
                filterTrackingPackages({ ...baseParams, ...deliveredDateParams, status: 'Đang vận chuyển' }),
                filterTrackingPackages({ ...baseParams, ...deliveredDateParams, status: 'Tái chế' })
            ]);

            setAllStats({
                total: totalRes.totalItems,
                packing: packingRes.totalItems,
                shipping: shippingRes.totalItems,
                closed: closedRes.totalItems,
                recycled: recycledRes.totalItems
            });
        } catch (err) {
            console.error('fetchAllStats error', err);
        }
    }, [filter.smallCollectionPointId, filter.fromDate, filter.toDate, filter.packageId]);

    const fetchPackageDetail = useCallback(
        async (packageId: string, page: number = 1, limit: number = 10) => {
            setLoadingDetail(true);
            try {
                const pkg = await getTrackingPackageDetail(packageId, page, limit);
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

    // Hàm cho Shipper: Lấy hàng từ đơn vị thu gom để vận chuyển đến nơi tái chế
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
        async (packageIds: string[], deliveryQrCode: string) => {
            setLoadingList(true);
            try {
                await deliverPackages(packageIds, deliveryQrCode);
                await fetchPackages();
                await fetchAllStats();
            } catch (err) {
                console.error('handleDeliverPackages error', err);
                throw err;
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