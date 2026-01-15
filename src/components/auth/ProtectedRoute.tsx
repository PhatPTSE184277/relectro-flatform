'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles?: string[]; // Các role được phép truy cập
}

// Map route prefix với role được phép
const ROUTE_ROLE_MAP: Record<string, string[]> = {
    '/admin': ['Admin'],
    '/company': ['AdminCompany'],
    '/small-collector': ['AdminWarehouse'],
    '/shipper': ['Collector'],
    '/recycle': ['RecyclingCompany'],
};

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
    const { isAuthenticated, loading, user } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        // Kiểm tra token thực tế trong localStorage/sessionStorage
        const checkToken = () => {
            if (typeof window !== 'undefined') {
                const token = localStorage.getItem('ewise_token') || sessionStorage.getItem('ewise_token');
                if (!token) {
                    // Không có token, redirect ngay
                    router.push('/');
                    return false;
                }
            }
            return true;
        };

        // Kiểm tra token trước
        if (!checkToken()) return;

        // Nếu chưa load xong thì chờ
        if (loading) return;

        // Nếu chưa đăng nhập thì redirect về login
        if (!isAuthenticated || !user) {
            router.push('/');
            return;
        }

        // Kiểm tra role nếu có allowedRoles được truyền vào
        if (allowedRoles && allowedRoles.length > 0) {
            if (!allowedRoles.includes(user.role)) {
                // Không có quyền truy cập, redirect về dashboard tương ứng
                redirectToRoleDashboard(user.role, router);
                return;
            }
        } else {
            // Nếu không có allowedRoles, tự động check theo pathname
            const routePrefix = Object.keys(ROUTE_ROLE_MAP).find(prefix => pathname.startsWith(prefix));
            
            if (routePrefix) {
                const allowedRolesForRoute = ROUTE_ROLE_MAP[routePrefix];
                if (!allowedRolesForRoute.includes(user.role)) {
                    // Không có quyền, redirect về dashboard đúng role
                    redirectToRoleDashboard(user.role, router);
                    return;
                }
            }
        }
    }, [isAuthenticated, loading, user, router, pathname, allowedRoles]);

    // Kiểm tra token thực tế
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('ewise_token') || sessionStorage.getItem('ewise_token');
        if (!token) {
            return null;
        }
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
    if (allowedRoles && allowedRoles.length > 0) {
        if (!allowedRoles.includes(user.role)) {
            return null;
        }
    } else {
        const routePrefix = Object.keys(ROUTE_ROLE_MAP).find(prefix => pathname.startsWith(prefix));
        if (routePrefix) {
            const allowedRolesForRoute = ROUTE_ROLE_MAP[routePrefix];
            if (!allowedRolesForRoute.includes(user.role)) {
                return null;
            }
        }
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
            router.push('/company/dashboard');
            break;
        case 'AdminWarehouse':
            router.push('/small-collector/dashboard');
            break;
        case 'Collector':
            router.push('/shipper/package');
            break;
        case 'RecyclingCompany':
            router.push('/recycle/package');
            break;
        default:
            router.push('/');
    }
}
