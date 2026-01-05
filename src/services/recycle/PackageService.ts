import axios from '@/lib/axios';
import {
    PackageType,
    FilterPackagesResponse
} from '@/types/Package';

export const filterPackages = async ({
    page = 1,
    limit = 10,
    recyclingCompanyId,
    status
}: {
    page?: number;
    limit?: number;
    recyclingCompanyId?: string;
    status?: string;
}): Promise<FilterPackagesResponse> => {
    const params: Record<string, any> = { Page: page, Limit: limit };
    if (recyclingCompanyId) params.RecyclingCompanyId = recyclingCompanyId;
    if (status && status.trim()) params.Status = status.trim();

    const response = await axios.get<FilterPackagesResponse>(
        '/RecyclingQuery/recycler-filter',
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
