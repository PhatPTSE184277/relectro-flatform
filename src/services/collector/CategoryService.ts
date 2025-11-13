import axios from '@/lib/axios';

export interface Category {
    id: string;
    name: string;
    parentCategoryId: string | null;
}

export const getParentCategories = async (): Promise<Category[]> => {
    const response = await axios.get('/categories/parents');
    return response.data;
};

export const getSubCategories = async (parentId: string): Promise<Category[]> => {
    const response = await axios.get(`/categories/${parentId}/subcategories`);
    return response.data;
};