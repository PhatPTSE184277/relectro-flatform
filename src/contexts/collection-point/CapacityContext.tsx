'use client';

import React, {
    createContext,
    useContext,
    useState,
    useCallback,
    useEffect,
    ReactNode
} from 'react';
import { getCapacityByCompany, CompanyCapacity } from '@/services/company/CapacityService';
import { useAuth } from '@/hooks/useAuth';

interface CapacityContextType {
    capacity: CompanyCapacity | null;
    loading: boolean;
    error: string | null;
    fetchCapacity: () => Promise<void>;
}

const CapacityContext = createContext<CapacityContextType | undefined>(undefined);

export const CapacityProvider = ({ children }: { children: ReactNode }) => {
    const { user } = useAuth();
    const [capacity, setCapacity] = useState<CompanyCapacity | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchCapacity = useCallback(async () => {
        const companyId = user?.collectionCompanyId;
        if (!companyId) return;
        setLoading(true);
        setError(null);
        try {
            const data = await getCapacityByCompany(String(companyId));
            setCapacity(data);
        } catch (err: any) {
            setError(err?.response?.data?.message || 'Lỗi khi tải dữ liệu năng lực đơn vị thu gom');
            setCapacity(null);
        } finally {
            setLoading(false);
        }
    }, [user?.collectionCompanyId]);

    useEffect(() => {
        void fetchCapacity();
    }, [fetchCapacity]);

    return (
        <CapacityContext.Provider value={{ capacity, loading, error, fetchCapacity }}>
            {children}
        </CapacityContext.Provider>
    );
};

export const useCapacityContext = (): CapacityContextType => {
    const ctx = useContext(CapacityContext);
    if (!ctx) throw new Error('useCapacityContext must be used within CapacityProvider');
    return ctx;
};

export default CapacityContext;
