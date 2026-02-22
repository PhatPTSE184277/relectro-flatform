import axios from '@/lib/axios';

export const getCollectionRoutesByDate = async ({
    page = 1,
    limit = 10,
    collectionPointId,
    pickUpDate,
    status
}: {
    page?: number;
    limit?: number;
    collectionPointId?: string;
    pickUpDate: string;
    status?: string;
}) => {
    const response = await axios.get('/routes/collection-point/date/filter', {
        params: {
            Page: page,
            Limit: limit,
            CollectionPointId: collectionPointId,
            PickUpDate: pickUpDate,
            Status: status
        }
    });
    return response.data;
};

export const seedProductsWithQRCodes = async (payload: {
    productIds: string[];
    qrCodes: string[];
}): Promise<any> => {
    const response = await axios.post('/products/seeder-qrcode', payload);
    return response.data;
};