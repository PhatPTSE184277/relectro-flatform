import axios from '@/lib/axios';

export interface FilterProductsResponse {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
    data: any[];
}

export const filterIncomingWarehouseProducts = async ({
    page = 1,
    limit = 10,
    pickUpDate,
    smallCollectionPointId,
    status
}: {
    page?: number;
    limit?: number;
    pickUpDate?: {
        year?: number;
        month?: number;
        day?: number;
        dayOfWeek?: number;
    };
    smallCollectionPointId?: number;
    status?: string;
}): Promise<FilterProductsResponse> => {
    const params: Record<string, any> = { page, limit };

    if (pickUpDate) params.pickUpDate = pickUpDate;
    if (smallCollectionPointId)
        params.smallCollectionPointId = smallCollectionPointId;
    if (status && status.trim()) params.status = status.trim();

    const response = await axios.get<FilterProductsResponse>(
        '/api/products/incoming-warehouse',
        {
            params
        }
    );
    return response.data;
};

export const receiveProductAtWarehouse = async (
    qrCode: string
): Promise<any> => {
    const response = await axios.put(
        `/api/products/receive-at-warehouse/${qrCode}`
    );
    return response.data;
};
