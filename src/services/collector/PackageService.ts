import axios from '@/lib/axios';

export interface PackageProductAttribute {
    attributeName: string;
    value: string;
    unit: string | null;
}

export interface PackageProduct {
    productId: string;
    description: string;
    categoryId: string;
    categoryName: string;
    brandId: string;
    brandName: string;
    qrCode: string | null;
    status: string | null;
    sizeTierName: string | null;
    attributes: PackageProductAttribute[];
}

export interface Package {
    packageId: string;
    packageName: string;
    smallCollectionPointsId: number;
    products: PackageProduct[];
}

export interface FilterPackagesResponse {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
    data: Package[];
}

export interface CreatePackagePayload {
    packageId: string;
    packageName: string;
    smallCollectionPointsId: number;
    productsQrCode: string[];
}

export const filterPackages = async ({
    page = 1,
    limit = 10,
    smallCollectionPointId = 1,
    status
}: {
    page?: number;
    limit?: number;
    smallCollectionPointId?: number;
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

export const getPackageById = async (packageId: string): Promise<Package> => {
    const response = await axios.get<Package>(`/packages/${packageId}`);
    return response.data;
};

export const createPackage = async (payload: CreatePackagePayload): Promise<any> => {
    const response = await axios.post('/packages', payload);
    return response.data;
};