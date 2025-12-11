export interface ProductAttribute {
    attributeName: string;
    value: string;
    unit: string | null;
}

export interface ProductScheduleSlot {
    startTime: string;
    endTime: string;
}

export interface ProductSchedule {
    dayName: string;
    pickUpDate: string;
    slots: ProductScheduleSlot;
}

export interface ProductSender {
    userId: string;
    name: string;
    email: string;
    phone: string;
    avatar: string;
    role: string;
    smallCollectionPointId: string;
    address?: string;
}

export interface ProductCollector {
    collectorId: string;
    name: string;
    email: string;
    phone: string;
    avatar: string;
    smallCollectionPointId: string;
}

export interface Product {
    productId: string;
    categoryId: string;
    categoryName: string;
    description: string | null;
    brandId: string;
    brandName: string;
    productImages: string[];
    qrCode?: string | null;
    status: string;
    attributes: ProductAttribute[];
    smallCollectionPointName?: string;
    pickUpDate?: string;
    estimatedTime?: string;
    estimatePoint?: number;
    realPoints?: number;
    sizeTierName?: string | null;
    rejectMessage?: string | null;
    sender?: ProductSender;
    collector?: ProductCollector;
    collectionRouterId?: string;
    address?: string;
    schedule?: ProductSchedule[];
    createdAt?: string;
}

export interface FilterProductsResponse {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
    data: Product[];
}

export interface CreateProductPayload {
    senderId: string;
    description: string;
    smallCollectionPointId: string;
    images: string[];
    parentCategoryId: string;
    subCategoryId: string;
    brandId: string;
    qrCode: string;
    point: number;
}
