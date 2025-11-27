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

export interface PackageType {
    packageId: string;
    packageName: string;
    smallCollectionPointsId: number;
    status?: string;
    products: PackageProduct[];
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
    packageName: string;
    smallCollectionPointsId: number;
    productsQrCode: string[];
}

export interface UpdatePackagePayload {
    packageName: string;
    smallCollectionPointsId: number;
    productsQrCode: string[];
}