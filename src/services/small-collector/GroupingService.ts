import axios from '@/lib/axios';

export interface PreAssignGroupingPayload {
    loadThresholdPercent: number;
}

export interface AssignDayGroupingPayload {
    workDate: string;
    vehicleId: string;
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
    collectionPointId: string
): Promise<any> => {
    const response = await axios.post('/grouping/pre-assign', {
        collectionPointId,
        ...payload
    });
    return response.data;
};

export const assignDayGrouping = async (
    payload: AssignDayGroupingPayload,
    collectionPointId: string
): Promise<any> => {
    const response = await axios.post('/grouping/assign-day', {
        collectionPointId,
        ...payload
    });
    return response.data;
};

export const autoGroup = async (payload: AutoGroupPayload, collectionPointId: string): Promise<any> => {
    const response = await axios.post('/grouping/auto-group', {
        collectionPointId,
        ...payload
    });
    return response.data;
};

export const getVehicles = async (smallCollectionPointId: string): Promise<Vehicle[]> => {
    const response = await axios.get(`/grouping/vehicles/${smallCollectionPointId}`);
    return response.data;
};

export const getGroupsByCollectionPointId = async (
    collectionPointId: string
): Promise<any[]> => {
    const response = await axios.get(`/grouping/groups/${collectionPointId}`);
    return response.data;
};

export const getGroupById = async (groupId: number): Promise<any> => {
    const response = await axios.get(`/grouping/group/${groupId}`);
    return response.data;
};

export interface PendingProductsResponse {
    smallPointId: string;
    smallPointName: string;
    radiusMaxConfigKm: number;
    maxRoadDistanceKm: number;
    total: number;
    totalWeightKg: number;
    totalVolumeM3: number;
    products: any[];
}

export const getPendingGroupingProducts = async (
    smallPointId: string,
    workDate: string
): Promise<PendingProductsResponse> => {
    const response = await axios.get(
        `/product-query/small-point/${smallPointId}`,
        { params: { workDate } }
    );
    return response.data;
};

// Lấy danh sách tài xế có thể phân lại
export const getReassignDriverCandidates = async (companyId: string, date: string): Promise<any[]> => {
    const response = await axios.get('/ReassignDriver/candidates', {
        params: { companyId, date }
    });
    return response.data;
};

// Xác nhận phân lại tài xế cho nhóm
export const confirmReassignDriver = async (groupId: number, newCollectorId: string): Promise<any> => {
    const response = await axios.post('/ReassignDriver/confirm', {
        groupId,
        newCollectorId
    });
    return response.data;
};