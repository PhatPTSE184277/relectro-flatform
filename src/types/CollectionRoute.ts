export interface CollectionRoute {
    collectionRouteId: string;
    postId: string;
    itemName: string;
    collector: {
        collectorId: string;
        name: string;
        email: string;
        phone: string;
        avatar: string;
    };
    sender: {
        userId: string;
        name: string;
        email: string;
        phone: string;
        address: string;
        avatar: string;
        iat: number;
        ing: number;
    };
    collectionDate: string;
    estimatedTime: string;
    actual_Time: string;
    confirmImages: string[];
    pickUpItemImages: string[];
    licensePlate: string;
    address: string;
    status: string;
}