import axios from '@/lib/axios';
import { SmallCollectionPoint } from '@/types';

export const importSmallCollectionExcel = async (file: File): Promise<any> => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await axios.post(
        '/small-collection/import-excel',
        formData,
        {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }
    );
    return response.data;
};

export interface SmallCollectionFilterParams {
    page?: number;
    limit?: number;
    companyId?: string;
    status?: string;
}

export const getSmallCollectionsFilter = async (
    params: SmallCollectionFilterParams
): Promise<any> => {
    const response = await axios.get('/small-collection/filter', {
        params
    });
    return response.data;
};

export const getSmallCollectionPointById = async (
    smallCollectionPointId: number | string
): Promise<SmallCollectionPoint> => {
    const response = await axios.get(
        `/small-collection/${smallCollectionPointId}`
    );
    return response.data;
};
