'use client';

import { useState, useCallback } from 'react';
import Header from '@/components/ui/Header';
import Sidebar from '@/components/ui/Sidebar';
import Toast from '@/components/ui/Toast';
import { recyclerMenuItems } from '@/constants/recycle/MenuItems';
import { RecyclerPackageProvider } from '@/contexts/recycle/PackageContext';
import { NotificationProvider } from '@/contexts/NotificationContext';
import { useNotificationHub } from '@/hooks/useNotificationHub';
import { useAuth } from '@/hooks/useAuth';

function LayoutContent({ children }: { children: React.ReactNode }) {
    const { user } = useAuth();
    const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

    const handleWarehouseNotification = useCallback((data: any) => {
        console.log('Recycle warehouse received notification:', data);
        
        if (data?.data?.action === 'WAREHOUSE_RECEIVED') {
            setNotification({
                type: data.type === 'error' ? 'error' : 'success',
                message: `${data.title}\n${data.message}`
            });
        }
    }, []);

    useNotificationHub({
        onAssignCompleted: handleWarehouseNotification,
        token: typeof window !== 'undefined' ? (localStorage.getItem('ewise_token') || sessionStorage.getItem('ewise_token') || '') : '',
        userId: user?.userId || ''
    });

    return (
        <>
            <div className='h-screen flex flex-col bg-gray-50'>
                <Header 
                    title="Bảng điều khiển tái chế" 
                    href="/recycle/dashboard" 
                    profileHref="/recycle/profile" 
                />
                <div className='flex flex-1 overflow-hidden'>
                    <Sidebar menuItems={recyclerMenuItems} />
                    <main className='flex-1 overflow-y-auto'>
                        {children}
                    </main>
                </div>
            </div>
            <Toast 
                open={!!notification} 
                type={notification?.type} 
                message={notification?.message || ''} 
                onClose={() => setNotification(null)}
            />
        </>
    );
}

export default function RecycleLayout({
    children
}: {
    children: React.ReactNode;
}) {
    return (
        <NotificationProvider>
            <RecyclerPackageProvider>
                <LayoutContent>{children}</LayoutContent>
            </RecyclerPackageProvider>
        </NotificationProvider>
    );
}
