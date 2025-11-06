import axios from '@/lib/axios';

export const getCollectionRoutesByDate = async (pickUpDate: string) => {
    // pickUpDate dạng "YYYY-MM-DD"
    const response = await axios.get(`/routes/${pickUpDate}`);
    return response.data;
};

export const getCollectionRouteDetail = async (collectionRouteId: string) => {
    const response = await axios.get(`/routes/detail/${collectionRouteId}`);
    return response.data;
};