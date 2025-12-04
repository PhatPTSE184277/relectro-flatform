export interface UserProfile {
    userId: string;
    name: string;
    email: string;
    phone: string;
    avatar: string;
    role: 'AdminWarehouse' | 'Collector' | 'User' | 'Admin' | 'AdminCompany';
    points: number;
    smallCollectionPointId?: number;
    collectionCompanyId?: number;
}

export interface AuthState {
    user: UserProfile | null;
    token: string | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
}

export interface LoginCredentials {
    username: string;
    password: string;
}

export interface LoginResponse {
    token: string;
}
