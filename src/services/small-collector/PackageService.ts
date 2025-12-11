import axios from '@/lib/axios';
import {
    PackageType,
    FilterPackagesResponse,
    CreatePackagePayload,
    UpdatePackagePayload
} from '@/types/Package';

export const filterPackages = async ({
    page = 1,
    limit = 10,
    smallCollectionPointId,
    status
}: {
    page?: number;
    limit?: number;
    smallCollectionPointId?: string;
    status?: string;
}): Promise<FilterPackagesResponse> => {
    const params: Record<string, any> = { page, limit };
    if (smallCollectionPointId) params.smallCollectionPointId = smallCollectionPointId;
    if (status && status.trim()) params.status = status.trim();

    const response = await axios.get<FilterPackagesResponse>(
        '/packages/filter',
        { params }
    );
    return response.data;
};

export const getPackageById = async (packageId: string): Promise<PackageType> => {
    const response = await axios.get<PackageType>(`/packages/${packageId}`);
    return response.data;
};

export const createPackage = async (payload: CreatePackagePayload): Promise<any> => {
    const response = await axios.post('/packages', payload);
    return response.data;
};

export const updatePackage = async (
    packageId: string,
    payload: UpdatePackagePayload
): Promise<any> => {
    const response = await axios.put(`/packages/${packageId}`, payload);
    return response.data;
};

export const updatePackageStatus = async (
    packageId: string
): Promise<any> => {
    const response = await axios.put(`/packages/${packageId}/status`);
    return response.data;
};

export const deliverPackage = async (packageId: string): Promise<any> => {
    const response = await axios.put(`/packages/${packageId}/delivery`);
    return response.data;
};

export const sendPackageToRecycler = async (packageId: string): Promise<any> => {
    const response = await axios.put(`/packages/${packageId}/recycler`);
    return response.data;
};
