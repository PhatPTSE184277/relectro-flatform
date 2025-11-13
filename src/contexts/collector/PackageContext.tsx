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
    Package,
    FilterPackagesResponse,
    CreatePackagePayload
} from '@/services/collector/PackageService';
import { toast } from 'react-toastify';

interface PackageFilter {
    page?: number;
    limit?: number;
    smallCollectionPointId?: number;
    status?: string;
}

interface PackageContextType {
    packages: Package[];
    loading: boolean;
    selectedPackage: Package | null;
    setSelectedPackage: (pkg: Package | null) => void;
    fetchPackages: (customFilter?: Partial<PackageFilter>) => Promise<void>;
    fetchPackageDetail: (packageId: string) => Promise<void>;
    createNewPackage: (payload: CreatePackagePayload) => Promise<void>;
    filter: PackageFilter;
    setFilter: (filter: Partial<PackageFilter>) => void;
    totalPages: number;
    totalItems: number;
    allStats: {
        total: number;
        packed: number;
        shipping: number;
        arrived: number;
    };
}

const PackageContext = createContext<PackageContextType | undefined>(undefined);

type Props = { children: ReactNode };

export const PackageProvider: React.FC<Props> = ({ children }) => {
    const [packages, setPackages] = useState<Package[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [allStats, setAllStats] = useState({
        total: 0,
        packed: 0,
        shipping: 0,
        arrived: 0
    });

    const [filter, setFilterState] = useState<PackageFilter>({
        page: 1,
        limit: 10,
        smallCollectionPointId: 1,
        status: 'Đã đóng thùng'
    });

    const setFilter = (newFilter: Partial<PackageFilter>) => {
        setFilterState((prev) => ({ ...prev, ...newFilter }));
    };

    const fetchPackages = useCallback(
        async (customFilter?: Partial<PackageFilter>) => {
            setLoading(true);
            try {
                const params: Record<string, any> = {
                    ...filter,
                    ...customFilter
                };
                Object.keys(params).forEach(
                    (key) => params[key] === undefined && delete params[key]
                );
                const response: FilterPackagesResponse = await filterPackages(params);
                setPackages(response.data || []);
                setTotalPages(response.totalPages);
                setTotalItems(response.totalItems);
            } catch (err) {
                console.error('fetchPackages error', err);
                toast.error('Lỗi khi tải danh sách package');
                setPackages([]);
            } finally {
                setLoading(false);
            }
        },
        [filter]
    );

    const fetchAllStats = useCallback(async () => {
        try {
            const baseParams = {
                page: 1,
                limit: 1,
                smallCollectionPointId: filter.smallCollectionPointId
            };

            const [totalRes, packedRes, shippingRes, arrivedRes] = await Promise.all([
                filterPackages(baseParams),
                filterPackages({ ...baseParams, status: 'Đã đóng thùng' }),
                filterPackages({ ...baseParams, status: 'Đang vận chuyển' }),
                filterPackages({ ...baseParams, status: 'Đến tái chế' })
            ]);

            setAllStats({
                total: totalRes.totalItems,
                packed: packedRes.totalItems,
                shipping: shippingRes.totalItems,
                arrived: arrivedRes.totalItems
            });
        } catch (err) {
            console.error('fetchAllStats error', err);
        }
    }, [filter.smallCollectionPointId]);

    const fetchPackageDetail = useCallback(
        async (packageId: string) => {
            setLoading(true);
            try {
                const pkg = await getPackageById(packageId);
                setSelectedPackage(pkg);
            } catch (err) {
                console.error('fetchPackageDetail error', err);
                toast.error('Không tìm thấy package này');
                setSelectedPackage(null);
            } finally {
                setLoading(false);
            }
        },
        []
    );

    const createNewPackage = useCallback(
        async (payload: CreatePackagePayload) => {
            setLoading(true);
            try {
                await createPackage(payload);
                toast.success('Tạo package thành công');
                await fetchPackages();
            } catch (err: any) {
                console.error('createNewPackage error', err);
                toast.error(err?.response?.data?.message || 'Lỗi khi tạo package');
                throw err;
            } finally {
                setLoading(false);
            }
        },
        [fetchPackages]
    );

    useEffect(() => {
        void fetchPackages();
        void fetchAllStats();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filter]);

    const value: PackageContextType = {
        packages,
        loading,
        selectedPackage,
        setSelectedPackage,
        fetchPackages,
        fetchPackageDetail,
        createNewPackage,
        filter,
        setFilter,
        totalPages,
        totalItems,
        allStats
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