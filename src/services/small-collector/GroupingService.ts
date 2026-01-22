import axios from '@/lib/axios';

export interface PreAssignGroupingPayload {
    loadThresholdPercent: number;
    productIds?: string[];
}

export interface AssignDayGroupingPayload {
    workDate: string;
    assignments: {
        vehicleId: string;
        productIds: string[];
    }[];
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

// Lấy danh sách nhóm theo collectionPointId với phân trang
export interface GroupListPagingResponse {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
    data: any[];
}

export interface GroupingPageResponse {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
    data: any[];
}

export const getGroupsByCollectionPointId = async (
    collectionPointId: string,
    page: number = 1,
    limit: number = 10
): Promise<GroupListPagingResponse> => {
    const response = await axios.get(`/grouping/groups/${collectionPointId}`, {
        params: { page, limit }
    });
    return response.data;
};

export const getGroupById = async (
    groupId: number,
    page: number = 1,
    limit: number = 10
): Promise<any> => {
    const response = await axios.get(`/grouping/group/${groupId}`, {
        params: { page, limit }
    });
    return response.data;
};

export interface PendingProductsResponse {
    smallPointId: string;
    smallPointName: string;
    radiusMaxConfigKm: number;
    maxRoadDistanceKm: number;
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
    totalWeightKg: number;
    totalVolumeM3: number;
    products: any[];
}

export const getPendingGroupingProducts = async (
    smallPointId: string,
    workDate: string,
    page?: number,
    limit?: number
): Promise<PendingProductsResponse> => {
    const params: any = { workDate };
    if (page !== undefined) params.page = page;
    if (limit !== undefined) params.limit = limit;
    const response = await axios.get(
        `/product-query/small-point/${smallPointId}`,
        { params }
    );
    return response.data;
};

// Lấy danh sách tài xế có thể phân lại
export const getReassignDriverCandidates = async (smallCollectionId: string, date: string): Promise<any[]> => {
    const response = await axios.get('/ReassignDriver/candidates', {
        params: { smallCollectionId, date }
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


// Lấy danh sách xe preview theo ngày làm việc
export const previewVehicles = async (workDate: string): Promise<any> => {
    const response = await axios.get('/grouping/preview-vehicles', {
        params: { workDate }
    });
    return response.data;
};

// Lấy danh sách sản phẩm preview theo xe và ngày làm việc
export interface PreviewProductsPagingResponse {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
    data: any[];
}

export const previewProducts = async (
    vehicleId: string,
    workDate: { year: number; month: number; day: number; dayOfWeek: number },
    page: number = 1,
    pageSize: number = 10
): Promise<PreviewProductsPagingResponse> => {
    const response = await axios.get('/grouping/preview-products', {
        params: { vehicleId, workDate, page, pageSize }
    });
    return response.data;
};