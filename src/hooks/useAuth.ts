'use client';

import { useAppSelector } from '@/redux/hooks';

export const useAuth = () => {
    const { user, isAuthenticated, loading, isFirstLogin } = useAppSelector((state) => state.auth);
    
    return {
        user,
        isAuthenticated,
        loading,
        isFirstLogin,
    };
};
