'use client';

import { useEffect } from 'react';
import { useAppDispatch } from '@/redux/hooks';
import { loadUserFromToken } from '@/redux/reducers/authReducer';

export default function AuthInitializer() {
    const dispatch = useAppDispatch();

    useEffect(() => {
        // Load user from token when app starts
        dispatch(loadUserFromToken());
    }, [dispatch]);

    return null;
}
