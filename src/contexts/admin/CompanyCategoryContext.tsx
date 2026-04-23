'use client';

import React, { createContext, useCallback, useContext, useState, ReactNode } from 'react';
import {
    getParentCategories,
    getSubcategories,
    getRecyclingCompanies,
    getCompanyCategories,
    registerCompanyCategories,
    updateCompanyCategories,
    Category,
    RecyclingCompany,
    PaginatedResponse,
    CompanyCategoryResponse,
    RegisterCompanyCategoriesPayload,
    UpdateCompanyCategoriesPayload,
} from '@/services/admin/CompanyCategoryService';

interface CompanyCategoryContextType {
    parentCategories: Category[];
    subcategories: Category[];
    recyclingCompanies: PaginatedResponse<RecyclingCompany> | null;
    companyCategories: CompanyCategoryResponse | null;
    loadingParents: boolean;
    loadingSubcategories: boolean;
    loadingCompanies: boolean;
    loadingCompanyCategories: boolean;
    loadingRegister: boolean;
    error: string | null;
    fetchParentCategories: () => Promise<void>;
    fetchSubcategories: (parentId: string) => Promise<void>;
    fetchRecyclingCompanies: (pageNumber?: number, pageSize?: number) => Promise<void>;
    fetchCompanyCategories: (companyId: string) => Promise<void>;
    registerCategories: (payload: RegisterCompanyCategoriesPayload) => Promise<void>;
    updateCategories: (payload: UpdateCompanyCategoriesPayload) => Promise<void>;
    clearError: () => void;
}

const CompanyCategoryContext = createContext<CompanyCategoryContextType | undefined>(undefined);

type Props = { children: ReactNode };

export const CompanyCategoryProvider: React.FC<Props> = ({ children }) => {
    const [parentCategories, setParentCategories] = useState<Category[]>([]);
    const [subcategories, setSubcategories] = useState<Category[]>([]);
    const [recyclingCompanies, setRecyclingCompanies] =
        useState<PaginatedResponse<RecyclingCompany> | null>(null);
    const [companyCategories, setCompanyCategories] = useState<CompanyCategoryResponse | null>(null);
    const [loadingParents, setLoadingParents] = useState(false);
    const [loadingSubcategories, setLoadingSubcategories] = useState(false);
    const [loadingCompanies, setLoadingCompanies] = useState(false);
    const [loadingCompanyCategories, setLoadingCompanyCategories] = useState(false);
    const [loadingRegister, setLoadingRegister] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchParentCategories = useCallback(async () => {
        setLoadingParents(true);
        setError(null);
        try {
            const data = await getParentCategories();
            setParentCategories(data);
        } catch (err: any) {
            setError(err?.response?.data?.message || 'Lỗi khi tải Danh mục lớn');
            setParentCategories([]);
        } finally {
            setLoadingParents(false);
        }
    }, []);

    const fetchSubcategories = useCallback(async (parentId: string) => {
        setLoadingSubcategories(true);
        setError(null);
        try {
            const data = await getSubcategories(parentId);
            setSubcategories(data);
        } catch (err: any) {
            setError(err?.response?.data?.message || 'Lỗi khi tải Danh mục nhỏ');
            setSubcategories([]);
        } finally {
            setLoadingSubcategories(false);
        }
    }, []);

    const fetchRecyclingCompanies = useCallback(async (pageNumber = 1, pageSize = 10) => {
        setLoadingCompanies(true);
        setError(null);
        try {
            const data = await getRecyclingCompanies(pageNumber, pageSize);
            setRecyclingCompanies(data);
        } catch (err: any) {
            setError(err?.response?.data?.message || 'Lỗi khi tải danh sách công ty');
            setRecyclingCompanies(null);
        } finally {
            setLoadingCompanies(false);
        }
    }, []);

    const fetchCompanyCategories = useCallback(async (companyId: string) => {
        setLoadingCompanyCategories(true);
        setError(null);
        try {
            const data = await getCompanyCategories(companyId);
            setCompanyCategories(data);
        } catch (err: any) {
            setError(err?.response?.data?.message || 'Lỗi khi tải danh mục công ty');
            setCompanyCategories(null);
        } finally {
            setLoadingCompanyCategories(false);
        }
    }, []);

    const registerCategories = useCallback(
        async (payload: RegisterCompanyCategoriesPayload) => {
            setLoadingRegister(true);
            setError(null);
            try {
                await registerCompanyCategories(payload);
                await fetchCompanyCategories(payload.companyId);
            } catch (err: any) {
                setError(err?.response?.data?.message || 'Lỗi khi đăng ký danh mục');
                throw err;
            } finally {
                setLoadingRegister(false);
            }
        },
        [fetchCompanyCategories]
    );

    const updateCategories = useCallback(
        async (payload: UpdateCompanyCategoriesPayload) => {
            setLoadingRegister(true);
            setError(null);
            try {
                await updateCompanyCategories(payload);
                await fetchCompanyCategories(payload.companyId);
            } catch (err: any) {
                setError(err?.response?.data?.message || 'Lỗi khi cập nhật danh mục');
                throw err;
            } finally {
                setLoadingRegister(false);
            }
        },
        [fetchCompanyCategories]
    );

    const clearError = useCallback(() => {
        setError(null);
    }, []);

    const value: CompanyCategoryContextType = {
        parentCategories,
        subcategories,
        recyclingCompanies,
        companyCategories,
        loadingParents,
        loadingSubcategories,
        loadingCompanies,
        loadingCompanyCategories,
        loadingRegister,
        error,
        fetchParentCategories,
        fetchSubcategories,
        fetchRecyclingCompanies,
        fetchCompanyCategories,
        registerCategories,
        updateCategories,
        clearError,
    };

    return (
        <CompanyCategoryContext.Provider value={value}>
            {children}
        </CompanyCategoryContext.Provider>
    );
};

export const useCompanyCategoryContext = (): CompanyCategoryContextType => {
    const ctx = useContext(CompanyCategoryContext);
    if (!ctx) throw new Error('useCompanyCategoryContext must be used within CompanyCategoryProvider');
    return ctx;
};
