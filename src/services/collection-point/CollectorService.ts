import axios from '@/lib/axios';

export interface FilterCollectorsParams {
    page?: number;
    limit?: number;
    companyId?: string;
    smallCollectionId?: string;
    smallCollectionPointId?: string;
    status?: string;
}

export interface CollectorItem {
    collectorId?: string;
    name?: string;
    email?: string;
    phone?: string;
    smallCollectionPointName?: string;
    status?: string;
    isActive?: boolean;
}

export interface CollectorPagingResponse {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
    data: CollectorItem[];
}

export const filterCollectors = async (
    params: FilterCollectorsParams
): Promise<CollectorPagingResponse> => {
    const smallCollectionPointId = params.smallCollectionPointId || params.smallCollectionId;
    if (!smallCollectionPointId) {
        throw new Error('smallCollectionPointId is required');
    }

    const response = await axios.get(
        `/collectors/collectionUnit/${smallCollectionPointId}`,
        {
            params: {
                page: params.page,
                limit: params.limit,
                status: params.status,
            },
        }
    );
    return response.data;
};

export const getCollectorById = async (
    collectorId: string
): Promise<any> => {
    const response = await axios.get(`/collectors/${collectorId}`);
    return response.data;
};

export const activateCollector = async (collectorId: string): Promise<any> => {
    const response = await axios.patch(`/collectors/active/${collectorId}`);
    return response.data;
};

export const deactivateCollector = async (collectorId: string): Promise<any> => {
    const response = await axios.patch(`/collectors/un-active/${collectorId}`);
    return response.data;
};

export const importCollectorsExcel = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await axios.post(
        '/collectors/import-excel',
        formData,
        {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }
    );
    return response.data;
};
