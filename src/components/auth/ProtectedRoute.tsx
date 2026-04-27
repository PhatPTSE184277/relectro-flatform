'use client';

import { useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useAppDispatch } from '@/redux/hooks';
import { loadUserFromToken } from '@/redux/reducers/authReducer';

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles?: string[]; // Các role được phép truy cập
}

// Map route prefix với role được phép
const ROUTE_ROLE_MAP: Record<string, string[]> = {
    '/admin': ['Admin'],
    '/collection-point': ['AdminWarehouse'],
    '/recycle': ['RecyclingCompany'],
};

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
    const { isAuthenticated, loading, user } = useAuth();
    const dispatch = useAppDispatch();
    const router = useRouter();
    const pathname = usePathname();
    const attemptedTokenLoadRef = useRef(false);

    const routePrefix = Object.keys(ROUTE_ROLE_MAP).find((prefix) => pathname.startsWith(prefix));
    const routeAllowedRoles = allowedRoles && allowedRoles.length > 0
        ? allowedRoles
        : routePrefix
            ? ROUTE_ROLE_MAP[routePrefix]
            : undefined;

    const hasToken = typeof window === 'undefined'
        ? true
        : Boolean(localStorage.getItem('ewise_token') || sessionStorage.getItem('ewise_token'));

    useEffect(() => {
        if (typeof window === 'undefined') return;

        if (!hasToken) {
            router.replace('/');
            return;
        }

        if (loading) return;

        if ((!isAuthenticated || !user) && !attemptedTokenLoadRef.current) {
            attemptedTokenLoadRef.current = true;
            void dispatch(loadUserFromToken());
            return;
        }

        if (!isAuthenticated || !user) {
            router.replace('/');
            return;
        }

        attemptedTokenLoadRef.current = false;

        if (routeAllowedRoles && !routeAllowedRoles.includes(user.role)) {
            redirectToRoleDashboard(user.role, router);
        }
    }, [dispatch, hasToken, isAuthenticated, loading, routeAllowedRoles, router, user]);

    // Kiểm tra token thực tế
    if (!hasToken) {
        return null;
    }

    // Loading state
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
            </div>
        );
    }

    // Chưa đăng nhập
    if (!isAuthenticated || !user) {
        return null;
    }

    // Kiểm tra role
    if (routeAllowedRoles && !routeAllowedRoles.includes(user.role)) {
        return null;
    }

    return <>{children}</>;
}

// Helper function để redirect về dashboard đúng role
function redirectToRoleDashboard(role: string, router: any) {
    switch (role) {
        case 'Admin':
            router.push('/admin/dashboard');
            break;
        case 'AdminCompany':
            router.push('/company/small-collection');
            break;
        case 'AdminWarehouse':
        case 'Collector':
            router.push('/collection-point/dashboard');
            break;
        case 'RecyclingCompany':
            router.push('/recycle/package');
            break;
        default:
            router.push('/');
    }
}
