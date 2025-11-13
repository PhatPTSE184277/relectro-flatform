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
    getParentCategories,
    getSubCategories,
    Category
} from '@/services/collector/CategoryService';
import { toast } from 'react-toastify';

interface CategoryContextType {
    parentCategories: Category[];
    subCategories: Category[];
    loading: boolean;
    fetchParentCategories: () => Promise<void>;
    fetchSubCategories: (parentId: string) => Promise<void>;
    selectedParentId: string | null;
    setSelectedParentId: (id: string | null) => void;
}

const CategoryContext = createContext<CategoryContextType | undefined>(undefined);

type Props = { children: ReactNode };

export const CategoryProvider: React.FC<Props> = ({ children }) => {
    const [parentCategories, setParentCategories] = useState<Category[]>([]);
    const [subCategories, setSubCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [selectedParentId, setSelectedParentId] = useState<string | null>(null);

    const fetchParentCategories = useCallback(async () => {
        setLoading(true);
        try {
            const data = await getParentCategories();
            setParentCategories(data || []);
        } catch (err) {
            toast.error('Lỗi khi tải danh mục cha');
            setParentCategories([]);
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchSubCategories = useCallback(async (parentId: string) => {
        setLoading(true);
        try {
            const data = await getSubCategories(parentId);
            setSubCategories(data || []);
        } catch (err) {
            toast.error('Lỗi khi tải danh mục con');
            setSubCategories([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchParentCategories();
    }, [fetchParentCategories]);

    useEffect(() => {
        if (selectedParentId) {
            fetchSubCategories(selectedParentId);
        } else {
            setSubCategories([]);
        }
    }, [selectedParentId, fetchSubCategories]);

    const value: CategoryContextType = {
        parentCategories,
        subCategories,
        loading,
        fetchParentCategories,
        fetchSubCategories,
        selectedParentId,
        setSelectedParentId,
    };

    return (
        <CategoryContext.Provider value={value}>
            {children}
        </CategoryContext.Provider>
    );
};

export const useCategoryContext = (): CategoryContextType => {
    const ctx = useContext(CategoryContext);
    if (!ctx)
        throw new Error('useCategoryContext must be used within CategoryProvider');
    return ctx;
};

export default CategoryContext;