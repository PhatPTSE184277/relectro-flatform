import axios from '@/lib/axios';

export interface PreAssignGroupingPayload {
    loadThresholdPercent: number;
}

export interface AssignDayGroupingPayload {
    workDate: string;
    vehicleId: number;
    postIds: string[];
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
    payload: PreAssignGroupingPayload
): Promise<any> => {
    const response = await axios.post('/grouping/pre-assign', {
        collectionPointId: 1,
        ...payload
    });
    return response.data;
};

export const assignDayGrouping = async (
    payload: AssignDayGroupingPayload
): Promise<any> => {
    const response = await axios.post('/grouping/assign-day', {
        collectionPointId: 1,
        ...payload
    });
    return response.data;
};

export const autoGroup = async (payload: AutoGroupPayload): Promise<any> => {
    const response = await axios.post('/grouping/auto-group', {
        collectionPointId: 1,
        ...payload
    });
    return response.data;
};

export const getVehicles = async (): Promise<Vehicle[]> => {
    const response = await axios.get('/grouping/vehicles');
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

export const getPendingGroupingPosts = async (): Promise<any[]> => {
    const response = await axios.get('/grouping/posts/pending-grouping');
    return response.data;
};
