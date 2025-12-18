export interface UserProfile {
    userId: string;
    name: string;
    email: string;
    phone: string;
    avatar: string;
    role: 'AdminWarehouse' | 'Collector' | 'User' | 'Admin' | 'AdminCompany' | 'Shipper' | 'Recycler';
    points: number;
    smallCollectionPointId?: string;
    collectionCompanyId?: string;
    isFirstLogin?: boolean;
}

export interface AuthState {
    user: UserProfile | null;
    token: string | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
    isFirstLogin: boolean;
}

export interface LoginCredentials {
    username: string;
    password: string;
}

export interface LoginResponse {
    accessToken: string;
    isFirstLogin: boolean;
}
