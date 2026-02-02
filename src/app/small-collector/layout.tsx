'use client';

import { useState, useCallback } from 'react';
import Header from '@/components/ui/Header';
import Sidebar from '@/components/ui/Sidebar';
import Toast from '@/components/ui/Toast';
import { collectorMenuItems } from '@/constants/small-collector/MenuItems';
import { CategoryProvider } from '@/contexts/small-collector/CategoryContext';
import { CollectionRouteProvider } from '@/contexts/small-collector/CollectionRouteContext';
import { GroupingProvider } from '@/contexts/small-collector/GroupingContext';
import { IWProductProvider } from '@/contexts/small-collector/IWProductContext';
import { PackageProvider } from '@/contexts/small-collector/PackageContext';
import { UserProvider } from '@/contexts/UserContext';
import { DashboardProvider } from '@/contexts/small-collector/DashboardContext';
import { NotificationProvider } from '@/contexts/NotificationContext';
import { useNotificationHub } from '@/hooks/useNotificationHub';
import { useAuth } from '@/hooks/useAuth';

function LayoutContent({ children }: { children: React.ReactNode }) {
    const { user } = useAuth();
    const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

    const handleCollectorNotification = useCallback((data: any) => {
        console.log('Small collector received notification:', data);
        
        if (data?.title && data?.message) {
            setNotification({
                type: data.type === 'error' ? 'error' : 'success',
                message: `${data.title}\n${data.message}`
            });
        }
    }, []);

    useNotificationHub({
        onAssignCompleted: handleCollectorNotification,
        token: typeof window !== 'undefined' ? (localStorage.getItem('ewise_token') || sessionStorage.getItem('ewise_token') || '') : '',
        userId: user?.userId || ''
    });

    return (
        <>
            <div className='h-screen flex flex-col bg-gray-50'>
                <Header
                    title='Bảng điều khiển thu gom'
                    href='/small-collector/dashboard'
                    profileHref='/employee/profile'
                />
                <div className='flex flex-1 overflow-hidden'>
                    <Sidebar
                        menuItems={collectorMenuItems}
                    />
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

export default function SmallCollectorLayout({
    children
}: {
    children: React.ReactNode;
}) {
    return (
        <NotificationProvider>
            <GroupingProvider>
                <CollectionRouteProvider>
                    <IWProductProvider>
                        <PackageProvider>
                            <UserProvider>
                                <CategoryProvider>
                                    <DashboardProvider>
                                        <LayoutContent>{children}</LayoutContent>
                                    </DashboardProvider>
                                </CategoryProvider>
                            </UserProvider>
                        </PackageProvider>
                    </IWProductProvider>
                </CollectionRouteProvider>
            </GroupingProvider>
        </NotificationProvider>
    );
}
