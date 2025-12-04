import axios from '@/lib/axios';

export interface PreAssignGroupingPayload {
    loadThresholdPercent: number;
}

export interface AssignDayGroupingPayload {
    workDate: string;
    vehicleId: number;
    productIds: string[];
}

export interface Vehicle {
    id: number;
    plate_Number: string;
    vehicle_Type: string;
    capacity_Kg: number;
    capacity_M3: number;
    radius_Km: number;
    status: string;
    small_Collection_Point: number;
}

export interface AutoGroupPayload {
    saveResult: boolean;
}

export const preAssignGrouping = async (
    payload: PreAssignGroupingPayload,
    collectionPointId: number
): Promise<any> => {
    const response = await axios.post('/grouping/pre-assign', {
        collectionPointId,
        ...payload
    });
    return response.data;
};

export const assignDayGrouping = async (
    payload: AssignDayGroupingPayload,
    collectionPointId: number
): Promise<any> => {
    const response = await axios.post('/grouping/assign-day', {
        collectionPointId,
        ...payload
    });
    return response.data;
};

export const autoGroup = async (payload: AutoGroupPayload, collectionPointId: number): Promise<any> => {
    const response = await axios.post('/grouping/auto-group', {
        collectionPointId,
        ...payload
    });
    return response.data;
};

export const getVehicles = async (smallCollectionPointId: number): Promise<Vehicle[]> => {
    const response = await axios.get(`/grouping/vehicles/${smallCollectionPointId}`);
    return response.data;
};

export const getGroupsByCollectionPointId = async (
    collectionPointId: number
): Promise<any[]> => {
    const response = await axios.get(`/grouping/groups/${collectionPointId}`);
    return response.data;
};

export const getGroupById = async (groupId: number): Promise<any> => {
    const response = await axios.get(`/grouping/group/${groupId}`);
    return response.data;
};

export interface PendingProductsResponse {
    smallPointId: number;
    smallPointName: string;
    radiusMaxConfigKm: number;
    maxRoadDistanceKm: number;
    total: number;
    totalWeightKg: number;
    totalVolumeM3: number;
    products: any[];
}

export const getPendingGroupingProducts = async (
    smallPointId: number,
    workDate: string
): Promise<PendingProductsResponse> => {
    const response = await axios.get(
        `/product-query/small-point/${smallPointId}`,
        { params: { workDate } }
    );
    return response.data;
};
