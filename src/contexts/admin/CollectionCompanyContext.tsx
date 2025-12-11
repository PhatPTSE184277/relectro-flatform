'use client';

import React, {
    createContext,
    useContext,
    useState,
    useCallback,
    useEffect,
    ReactNode
} from 'react';
import {
    getCollectionCompanies,
    getCollectionCompanyById,
    importCollectionCompaniesFromExcel,
    CollectionCompany
} from '@/services/admin/CollectionCompanyService';
import { toast } from 'react-toastify';
import { useAuth } from '@/hooks/useAuth';

interface CollectionCompanyContextType {
    companies: CollectionCompany[];
    loading: boolean;
    error: string | null;
    fetchCompanies: () => Promise<void>;
    fetchCompanyById: (id: number) => Promise<CollectionCompany | null>;
    importFromExcel: (file: File) => Promise<any>;
    clearCompanies: () => void;
}

const CollectionCompanyContext = createContext<
    CollectionCompanyContextType | undefined
>(undefined);

type Props = { children: ReactNode };

export const CollectionCompanyProvider: React.FC<Props> = ({ children }) => {
    const { user } = useAuth();
    const [companies, setCompanies] = useState<CollectionCompany[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchCompanies = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getCollectionCompanies();
            
            // Nếu là Collector, chỉ lấy công ty của mình
            if (user?.role === 'Collector' && user?.collectionCompanyId) {
                const filteredData = data.filter(
                    (company) => String(company.id) === String(user.collectionCompanyId)
                );
                setCompanies(filteredData);
            } else {
                setCompanies(data);
            }
        } catch (err: any) {
            setError(
                err?.response?.data?.message ||
                    'Lỗi khi tải danh sách công ty thu gom'
            );
            setCompanies([]);
        } finally {
            setLoading(false);
        }
    }, [user]);

    const fetchCompanyById = useCallback(async (id: string | number) => {
        setLoading(true);
        setError(null);
        try {
            const data = await getCollectionCompanyById(String(id));
            return data;
        } catch (err: any) {
            setError(
                err?.response?.data?.message || 'Lỗi khi tải chi tiết công ty'
            );
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    const importFromExcel = useCallback(
        async (file: File) => {
            setLoading(true);
            setError(null);
            try {
                const res = await importCollectionCompaniesFromExcel(file);
                toast.success('Import thành công');
                await fetchCompanies();
                return res;
            } catch (err: any) {
                setError(err?.response?.data?.message || 'Lỗi khi import file');
                toast.error('Import thất bại');
                return null;
            } finally {
                setLoading(false);
            }
        },
        [fetchCompanies]
    );

    const clearCompanies = useCallback(() => {
        setCompanies([]);
        setError(null);
    }, []);

    useEffect(() => {
        void fetchCompanies();
    }, [fetchCompanies]);

    const value: CollectionCompanyContextType = {
        companies,
        loading,
        error,
        fetchCompanies,
        fetchCompanyById,
        importFromExcel,
        clearCompanies
    };

    return (
        <CollectionCompanyContext.Provider value={value}>
            {children}
        </CollectionCompanyContext.Provider>
    );
};

export const useCollectionCompanyContext = (): CollectionCompanyContextType => {
    const ctx = useContext(CollectionCompanyContext);
    if (!ctx)
        throw new Error(
            'useCollectionCompanyContext must be used within CollectionCompanyProvider'
        );
    return ctx;
};
