import axios from '@/lib/axios';

export interface Brand {
    id: string;
    name: string;
}

export const getBrandsBySubCategory = async (categoryId: string): Promise<Brand[]> => {
    const response = await axios.get(`/brands/sub-category/${categoryId}`);
    return response.data;
};