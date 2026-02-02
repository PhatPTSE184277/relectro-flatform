'use client';

import { useState, useCallback } from 'react';
import Header from '@/components/ui/Header';
import Sidebar from '@/components/ui/Sidebar';
import Toast from '@/components/ui/Toast';
import { shipperMenuItems } from '@/constants/shipper/MenuItems';
import { ShipperPackageProvider } from '@/contexts/shipper/PackageContext';
import { NotificationProvider } from '@/contexts/NotificationContext';
import { useNotificationHub } from '@/hooks/useNotificationHub';
import { useAuth } from '@/hooks/useAuth';

function LayoutContent({ children }: { children: React.ReactNode }) {
    const { user } = useAuth();
    const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

    const handleShipperNotification = useCallback((data: any) => {
        console.log('Shipper received notification:', data);
        
        if (data?.title && data?.message) {
            setNotification({
                type: data.type === 'error' ? 'error' : 'success',
                message: `${data.title}\n${data.message}`
            });
        }
    }, []);

    useNotificationHub({
        onAssignCompleted: handleShipperNotification,
        token: typeof window !== 'undefined' ? (localStorage.getItem('ewise_token') || sessionStorage.getItem('ewise_token') || '') : '',
        userId: user?.userId || ''
    });

    return (
        <>
            <div className='h-screen flex flex-col bg-gray-50'>
                <Header 
                    title="Bảng điều khiển vận chuyển" 
                    href="/shipper/dashboard" 
                    profileHref="/shipper/profile" 
                />
                <div className='flex flex-1 overflow-hidden'>
                    <Sidebar menuItems={shipperMenuItems} />
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

export default function ShipperLayout({
    children
}: {
    children: React.ReactNode;
}) {
    return (
        <NotificationProvider>
            <ShipperPackageProvider>
                <LayoutContent>{children}</LayoutContent>
            </ShipperPackageProvider>
        </NotificationProvider>
    );
}
