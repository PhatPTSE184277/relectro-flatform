import axios from '@/lib/axios';
import {
    PackageType,
    FilterPackagesResponse
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
    if (smallCollectionPointId) params.smallCollectionPointId = "2";
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

export const sendPackageToRecycler = async (packageId: string): Promise<any> => {
    const response = await axios.put(`/packages/${packageId}/recycler`);
    return response.data;
};

export const markProductsAsChecked = async ({
    packageId,
    productQrCode
}: {
    packageId: string;
    productQrCode: string[];
}): Promise<any> => {
    const response = await axios.put('/products/checked', {
        packageId,
        productQrCode
    });
    return response.data;
};
