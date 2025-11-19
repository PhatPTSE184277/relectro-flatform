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
    smallCollectionPointId: number;
    images: string[];
    parentCategoryId: string;
    subCategoryId: string;
    brandId: string;
    qrCode: string;
    point: number;
}

export const filterIncomingWarehouseProducts = async ({
    fromDate,
    toDate,
    smallCollectionPointId = 1
}: {
    fromDate?: string;
    toDate?: string;
    smallCollectionPointId?: number;
}): Promise<FilterProductsResponse> => {
    const params: Record<string, any> = {};

    if (fromDate) params.fromDate = fromDate;
    if (toDate) params.toDate = toDate;
    if (smallCollectionPointId)
        params.smallCollectionPointId = smallCollectionPointId;

    const response = await axios.get<FilterProductsResponse>(
        '/products/from-data-to-date',
        { params }
    );
    return response.data;
};

export const receiveProductAtWarehouse = async (
    qrCode: string,
    productId?: string,
    description?: string,
    point?: number
): Promise<any> => {
    const body: Record<string, any> = {
        description: description || '',
        point: point || 0
    };
    if (productId) body.productId = productId;
    const response = await axios.put(
        `/products/receive-at-warehouse/${qrCode}`,
        body
    );
    return response.data;
};

export const getProductByQRCode = async (qrCode: string): Promise<any> => {
    const response = await axios.get(`/products/qrcode/${qrCode}`);
    return response.data;
};

export const createIncomingWarehouseProduct = async (
    payload: CreateProductPayload
): Promise<any> => {
    const response = await axios.post('/products/warehouse', payload);
    return response.data;
};
