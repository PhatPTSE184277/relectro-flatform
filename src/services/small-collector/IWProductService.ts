import axios from '@/lib/axios';
import type { Product, FilterProductsResponse, CreateProductPayload } from '@/types/Product';

export type { Product, FilterProductsResponse, CreateProductPayload };

export const filterIncomingWarehouseProducts = async ({
    fromDate,
    toDate,
    smallCollectionPointId
}: {    
    fromDate?: string;
    toDate?: string;
    smallCollectionPointId: string;
}): Promise<FilterProductsResponse> => {
    const params: Record<string, any> = {};

    if (fromDate) params.fromDate = fromDate;
    if (toDate) params.toDate = toDate;
    if (smallCollectionPointId)
        params.smallCollectionPointId = smallCollectionPointId;

    const response = await axios.get<FilterProductsResponse>(
        '/products/from-date-to-date',
        { params }
    );
    return response.data;
};

export const receiveProductAtWarehouse = async (
    qrCode: string,
    productId?: string,
    description?: string | null,
    point?: number
): Promise<any> => {
    const body: Record<string, any> = {
        description: description === null ? null : (description || ''),
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

// Get product by ID
export const getProductById = async (id: string): Promise<Product> => {
    const response = await axios.get(`/products/${id}`);
    return response.data;
};

// Update points transaction for a product
export const updatePointsTransaction = async (
    productId: string,
    newPointValue: number,
    reasonForUpdate?: string
): Promise<any> => {
    const body = {
        newPointValue: newPointValue,
        reasonForUpdate: reasonForUpdate || ''
    };

    const response = await axios.put(`/points-transaction/${productId}`, body);
    return response.data;
};
