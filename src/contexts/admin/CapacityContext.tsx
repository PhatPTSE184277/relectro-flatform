'use client';

import React, {
    createContext,
    useContext,
    useState,
    useCallback,
    useEffect,
    ReactNode
} from 'react';
import { getCapacityByCompany, CompanyCapacity } from '@/services/admin/CapacityService';
import { filterCollectionCompanies } from '@/services/admin/TrackingService';

interface CapacityContextType {
    companies: any[];
    capacity: CompanyCapacity | null;
    loadingCompanies: boolean;
    loadingCapacity: boolean;
    error: string | null;
    fetchCompanies: () => Promise<void>;
    fetchCapacity: (companyId: string) => Promise<void>;
}

const CapacityContext = createContext<CapacityContextType | undefined>(undefined);

type Props = { children: ReactNode };

export const CapacityProvider: React.FC<Props> = ({ children }) => {
    const [companies, setCompanies] = useState<any[]>([]);
    const [capacity, setCapacity] = useState<CompanyCapacity | null>(null);
    const [loadingCompanies, setLoadingCompanies] = useState(false);
    const [loadingCapacity, setLoadingCapacity] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchCompanies = useCallback(async () => {
        setLoadingCompanies(true);
        setError(null);
        try {
            const data = await filterCollectionCompanies({ page: 1, limit: 100 });
            setCompanies(Array.isArray(data) ? data : (data.data || []));
        } catch (err: any) {
            setError(err?.response?.data?.message || 'Lỗi khi tải danh sách công ty');
            setCompanies([]);
        } finally {
            setLoadingCompanies(false);
        }
    }, []);

    const fetchCapacity = useCallback(async (companyId: string) => {
        setLoadingCapacity(true);
        setError(null);
        try {
            const data = await getCapacityByCompany(companyId);
            setCapacity(data);
        } catch (err: any) {
            setError(err?.response?.data?.message || 'Lỗi khi tải dữ liệu năng lực đơn vị thu gom');
            setCapacity(null);
        } finally {
            setLoadingCapacity(false);
        }
    }, []);

    useEffect(() => {
        void fetchCompanies();
    }, [fetchCompanies]);

    const value: CapacityContextType = {
        companies,
        capacity,
        loadingCompanies,
        loadingCapacity,
        error,
        fetchCompanies,
        fetchCapacity,
    };

    return (
        <CapacityContext.Provider value={value}>
            {children}
        </CapacityContext.Provider>
    );
};

export const useCapacityContext = (): CapacityContextType => {
    const ctx = useContext(CapacityContext);
    if (!ctx)
        throw new Error('useCapacityContext must be used within CapacityProvider');
    return ctx;
};

export default CapacityContext;
