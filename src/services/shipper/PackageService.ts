import axios from '@/lib/axios';
import {
    PackageType,
    FilterPackagesResponse
} from '@/types/Package';

export const filterPackages = async ({
    page = 1,
    limit = 10,
    recyclerId,
    status
}: {
    page?: number;
    limit?: number;
    recyclerId?: string;
    status?: string;
}): Promise<FilterPackagesResponse> => {
    const params: Record<string, any> = { page, limit };
    if (recyclerId && recyclerId.trim()) params.recyclerId = recyclerId.trim();
    if (status && status.trim()) params.status = status.trim();

    const response = await axios.get<FilterPackagesResponse>(
        '/packages/recycler/filter',
        { params }
    );
    return response.data;
};

export const getPackageById = async (
    packageId: string,
    page: number = 1,
    limit: number = 10
): Promise<PackageType> => {
    const response = await axios.get<PackageType>(`/packages/${packageId}`, {
        params: { page, limit }
    });
    return response.data;
};

export const deliverPackage = async (packageId: string): Promise<any> => {
    const response = await axios.put(`/packages/${packageId}/delivery`);
    return response.data;
};
