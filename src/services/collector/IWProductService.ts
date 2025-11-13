import axios from '@/lib/axios';

export interface Product {
    productId: string;
    categoryId: string;
    categoryName: string;
    description: string;
    brandId: string;
    brandName: string;
    productImages: string[];
    qrCode: string | null;
    status: string;
    sizeTierName: string | null;
    attributes: any[];
    smallCollectionPointName?: string;
    pickUpDate?: string;
}

export interface FilterProductsResponse {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
    data: Product[];
}

export interface CreateProductPayload {
    senderId: string;
    description: string;
    images: string[];
    parentCategoryId: string;
    subCategoryId: string;
    brandId: string;
    qrCode: string;
    point: number;
}

export const filterIncomingWarehouseProducts = async ({
    page = 1,
    limit = 10,
    pickUpDate,
    smallCollectionPointId = 1,
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

    if (pickUpDate) {
        if (typeof pickUpDate === 'string') {
            params.pickUpDate = pickUpDate;
        } else if (typeof pickUpDate === 'object') {
            // Chuyển object sang YYYY-MM-DD
            const { year, month, day } = pickUpDate;
            if (year && month && day) {
                params.pickUpDate = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            }
        }
    }
    if (smallCollectionPointId)
        params.smallCollectionPointId = smallCollectionPointId;
    if (status && status.trim()) params.status = status.trim();

    const response = await axios.get<FilterProductsResponse>(
        '/products/incoming-warehouse',
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
        `/products/receive-at-warehouse/${qrCode}`
    );
    return response.data;
};

export const getProductByQRCode = async (
    qrCode: string
): Promise<any> => {
    const response = await axios.get(`/products/qrcode/${qrCode}`);
    return response.data;
};

export const createIncomingWarehouseProduct = async (
    payload: CreateProductPayload
): Promise<any> => {
    const response = await axios.post('/products/warehouse', payload);
    return response.data;
};