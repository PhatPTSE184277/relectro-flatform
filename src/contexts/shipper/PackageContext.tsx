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
    deliverPackage
} from '@/services/shipper/PackageService';
import { PackageType, FilterPackagesResponse } from '@/types/Package';
import { PackageStatus } from '@/enums/PackageStatus';

interface PackageFilter {
    page?: number;
    limit?: number;
    status?: string;
    smallCollectionPointId?: string;
}

interface PackageContextType {
    packages: PackageType[];
    loading: boolean;
    selectedPackage: PackageType | null;
    setSelectedPackage: (pkg: PackageType | null) => void;
    fetchPackages: (customFilter?: Partial<PackageFilter>) => Promise<void>;
    fetchPackageDetail: (packageId: string) => Promise<void>;
    handleDeliverPackage: (packageId: string) => Promise<void>;
    filter: PackageFilter;
    setFilter: (filter: Partial<PackageFilter>) => void;
    totalPages: number;
    totalItems: number;
    allStats: {
        closed: number;
        shipping: number;
    };
}

const PackageContext = createContext<PackageContextType | undefined>(undefined);

type Props = { children: ReactNode };

export const ShipperPackageProvider: React.FC<Props> = ({ children }) => {
    const [packages, setPackages] = useState<PackageType[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [selectedPackage, setSelectedPackage] = useState<PackageType | null>(null);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [allStats, setAllStats] = useState({ closed: 0, shipping: 0 });

    const [filter, setFilterState] = useState<PackageFilter>({
        page: 1,
        limit: 10,
        status: PackageStatus.Closed
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
                // Remove undefined values
                Object.keys(params).forEach(
                    (key) => params[key] === undefined && delete params[key]
                );
                
                const response: FilterPackagesResponse = await filterPackages(params);
                setPackages(response.data || []);
                setTotalPages(response.totalPages);
                setTotalItems(response.totalItems);
            } catch (err) {
                console.error('fetchPackages error', err);
                // ...existing code...
                setPackages([]);
            } finally {
                setLoading(false);
            }
        },
        [filter]
    );

    // Fetch stats for all statuses
    const fetchAllStats = useCallback(async () => {
        try {
            const [closedRes, shippingRes] = await Promise.all([
                filterPackages({ page: 1, limit: 1, status: PackageStatus.Closed }),
                filterPackages({ page: 1, limit: 1, status: PackageStatus.Shipping })
            ]);
            setAllStats({
                closed: closedRes.totalItems,
                shipping: shippingRes.totalItems
            });
        } catch (err) {
            console.error('fetchAllStats error', err);
        }
    }, []);

    const fetchPackageDetail = useCallback(
        async (packageId: string) => {
            setLoading(true);
            try {
                const pkg = await getPackageById(packageId);
                setSelectedPackage(pkg);
            } catch (err) {
                console.error('fetchPackageDetail error', err);
                // ...existing code...
                setSelectedPackage(null);
            } finally {
                setLoading(false);
            }
        },
        []
    );

    const handleDeliverPackage = useCallback(
        async (packageId: string) => {
            setLoading(true);
            try {
                await deliverPackage(packageId);
                // ...existing code...
                await fetchPackages();
                await fetchAllStats();
            } catch (err) {
                console.error('handleDeliverPackage error', err);
                // ...existing code...
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
        handleDeliverPackage,
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

export const useShipperPackageContext = (): PackageContextType => {
    const ctx = useContext(PackageContext);
    if (!ctx)
        throw new Error('useShipperPackageContext must be used within ShipperPackageProvider');
    return ctx;
};

export default PackageContext;
