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

export const getCollectionRouteDetail = async (collectionRouteId: string) => {
    const response = await axios.get(`/routes/detail/${collectionRouteId}`);
    return response.data;
};