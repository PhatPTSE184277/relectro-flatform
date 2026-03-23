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
    isChecked?: boolean;
    attributes: PackageProductAttribute[];
}

export interface PackageProductsResponse {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
    data: PackageProduct[];
}

export interface PackageType {
    packageId: string;
    smallCollectionPointsId: string;
    smallCollectionPointsName?: string;
    smallCollectionPointsAddress?: string;
    recyclerName?: string;
    recyclerAddress?: string;
    deliveryAt?: string;
    status?: string;
    statusHistories?: Array<{
        description: string;
        status: string;
        createAt?: string;
        createdAt?: string;
    }>;
    products: PackageProductsResponse;
}

export interface FilterPackagesResponse {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
    data: PackageType[];
}

export interface CreatePackagePayload {
    packageId: string;
    smallCollectionPointsId: string;
    productsQrCode: string[];
}

export interface UpdatePackagePayload {
    smallCollectionPointsId: string;
    productsQrCode: string[];
}