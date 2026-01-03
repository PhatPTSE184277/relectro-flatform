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
    sendPackageToRecycler,
    markProductsAsChecked
} from '@/services/recycle/PackageService';
import { PackageType, FilterPackagesResponse } from '@/types/Package';
import { PackageStatus } from '@/enums/PackageStatus';

interface PackageFilter {
    page?: number;
    limit?: number;
    status?: string;
}

interface PackageContextType {
    packages: PackageType[];
    loading: boolean;
    selectedPackage: PackageType | null;
    setSelectedPackage: (pkg: PackageType | null) => void;
    fetchPackages: (customFilter?: Partial<PackageFilter>) => Promise<void>;
    fetchPackageDetail: (packageId: string) => Promise<void>;
    handleSendPackageToRecycler: (packageId: string) => Promise<void>;
    handleMarkProductsAsChecked: (data: { packageId: string; productQrCode: string[] }) => Promise<void>;
    filter: PackageFilter;
    setFilter: (filter: Partial<PackageFilter>) => void;
    totalPages: number;
    totalItems: number;
    allStats: {
        shipping: number;
        recycling: number;
    };
}

const PackageContext = createContext<PackageContextType | undefined>(undefined);

type Props = { children: ReactNode };

export const RecyclerPackageProvider: React.FC<Props> = ({ children }) => {
    const [packages, setPackages] = useState<PackageType[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [selectedPackage, setSelectedPackage] = useState<PackageType | null>(null);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [allStats, setAllStats] = useState({ shipping: 0, recycling: 0 });

    const [filter, setFilterState] = useState<PackageFilter>({
        page: 1,
        limit: 10,
        status: PackageStatus.Shipping
    });

    const setFilter = (newFilter: Partial<PackageFilter>) => {
        setFilterState((prev) => ({ ...prev, ...newFilter }));
    };

    const fetchAllStats = useCallback(async () => {
        try {
            const [shippingRes, recyclingRes] = await Promise.all([
                filterPackages({ status: PackageStatus.Shipping, limit: 1 }),
                filterPackages({ status: PackageStatus.Recycling, limit: 1 })
            ]);
            setAllStats({
                shipping: shippingRes.totalItems || 0,
                recycling: recyclingRes.totalItems || 0
            });
        } catch (err) {
            console.error('fetchAllStats error', err);
        }
    }, []);

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
                setPackages([]);
            } finally {
                setLoading(false);
            }
        },
        [filter]
    );

    const fetchPackageDetail = useCallback(
        async (packageId: string) => {
            setLoading(true);
            try {
                const pkg = await getPackageById(packageId);
                setSelectedPackage(pkg);
            } catch (err) {
                console.error('fetchPackageDetail error', err);
                setSelectedPackage(null);
            } finally {
                setLoading(false);
            }
        },
        []
    );

    const handleSendPackageToRecycler = useCallback(
        async (packageId: string) => {
            setLoading(true);
            try {
                await sendPackageToRecycler(packageId);
                await fetchPackages();
                await fetchAllStats();
            } catch (err) {
                console.error('handleSendPackageToRecycler error', err);
            } finally {
                setLoading(false);
            }
        },
        [fetchPackages, fetchAllStats]
    );

    const handleMarkProductsAsChecked = useCallback(
        async ({ packageId, productQrCode }: { packageId: string; productQrCode: string[] }) => {
            setLoading(true);
            try {
                await markProductsAsChecked({ packageId, productQrCode });
                await fetchPackages();
                await fetchAllStats();
            } catch (err) {
                console.error('handleMarkProductsAsChecked error', err);
            } finally {
                setLoading(false);
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
        loading,
        selectedPackage,
        setSelectedPackage,
        fetchPackages,
        fetchPackageDetail,
        handleSendPackageToRecycler,
        handleMarkProductsAsChecked,
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

export const useRecyclerPackageContext = (): PackageContextType => {
    const ctx = useContext(PackageContext);
    if (!ctx)
        throw new Error('useRecyclerPackageContext must be used within RecyclerPackageProvider');
    return ctx;
};

export default PackageContext;
