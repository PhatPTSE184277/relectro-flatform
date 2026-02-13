'use client';

import Header from '@/components/ui/Header';
import Sidebar from '@/components/ui/Sidebar';
import Toast from '@/components/ui/Toast';
import { collectorMenuItems } from '@/constants/small-collector/MenuItems';
import { CategoryProvider } from '@/contexts/small-collector/CategoryContext';
import { CollectionRouteProvider } from '@/contexts/small-collector/CollectionRouteContext';
import { GroupingProvider } from '@/contexts/small-collector/GroupingContext';
import { IWProductProvider } from '@/contexts/small-collector/IWProductContext';
import { PackageProvider } from '@/contexts/small-collector/PackageContext';
import { SmallCollectorQRProvider } from '@/contexts/small-collector/QRContext';
import { UserProvider } from '@/contexts/UserContext';
import { DashboardProvider } from '@/contexts/small-collector/DashboardContext';
import { NotificationProvider, useNotifications } from '@/contexts/NotificationContext';
import { useAuth } from '@/hooks/useAuth';

function LayoutContent({ children }: { children: React.ReactNode }) {
    const { toast, hideToast } = useNotifications();
    const { user } = useAuth();
    
    const headerTitle = user?.smallCollectionName || 'Bảng điều khiển thu gom';

    return (
        <>
            <div className='h-screen flex flex-col bg-gray-50'>
                <Header
                    title={headerTitle}
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
                open={!!toast} 
                type={toast?.type} 
                message={toast?.message || ''} 
                onClose={hideToast}
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
                            <SmallCollectorQRProvider>
                                <UserProvider>
                                    <CategoryProvider>
                                        <DashboardProvider>
                                            <LayoutContent>{children}</LayoutContent>
                                        </DashboardProvider>
                                    </CategoryProvider>
                                </UserProvider>
                            </SmallCollectorQRProvider>
                        </PackageProvider>
                    </IWProductProvider>
                </CollectionRouteProvider>
            </GroupingProvider>
        </NotificationProvider>
    );
}
