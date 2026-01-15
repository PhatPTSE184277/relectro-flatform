'use client';

import { useEffect } from 'react';
import { useAppDispatch } from '@/redux/hooks';
import { loadUserFromToken, logout } from '@/redux/reducers/authReducer';

export default function AuthInitializer() {
    const dispatch = useAppDispatch();

    useEffect(() => {
        // Load user from token when app starts
        dispatch(loadUserFromToken());

        // Listen for logout event from axios interceptor
        const handleLogout = () => {
            dispatch(logout());
        };

        if (typeof window !== 'undefined') {
            window.addEventListener('auth:logout', handleLogout);
        }

        return () => {
            if (typeof window !== 'undefined') {
                window.removeEventListener('auth:logout', handleLogout);
            }
        };
    }, [dispatch]);

    return null;
}
