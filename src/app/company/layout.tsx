'use client';

import Header from '@/components/ui/Header';
import Sidebar from '@/components/ui/Sidebar';
import Toast from '@/components/ui/Toast';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { MenuItems } from '@/constants/company/MenuItems';
import { CollectorProvider } from '@/contexts/collection-point/CollectorContext';
import { SmallCollectionProvider } from '@/contexts/company/SmallCollectionContext';
import { ProductQueryProvider } from '@/contexts/company/ProductQueryContext';
import { ShiftProvider } from '@/contexts/collection-point/ShiftContext';
import { VehicleProvider } from '@/contexts/company/VehicleContext';
import { SettingGroupProvider } from '@/contexts/collection-point/SettingGroupContext';
import { CapacityProvider } from '@/contexts/collection-point/CapacityContext';
import { NotificationProvider, useNotifications } from '@/contexts/NotificationContext';
import { UserProvider } from '@/contexts/UserContext';
import { useAuth } from '@/hooks/useAuth';

function LayoutContent({ children }: { children: React.ReactNode }) {
    const { toast, hideToast } = useNotifications();
    const { user } = useAuth();
    
    const headerTitle = user?.companyName || 'Bảng điều khiển thu gom lớn';

    return (
        <>
            <ProtectedRoute>
                <div className='h-screen flex flex-col bg-gray-50'>
                    <Header 
                        title={headerTitle} 
                        href="/large-collector/dashboard" 
                        profileHref="/company/profile" 
                    />
                    <div className='flex flex-1 overflow-hidden'>
                        <Sidebar menuItems={MenuItems} />
                        <main className='flex-1 overflow-y-auto'>{children}</main>
                    </div>
                </div>
                <Toast 
                    open={!!toast} 
                    type={toast?.type} 
                    message={toast?.message || ''} 
                    onClose={hideToast}
                />
            </ProtectedRoute>
        </>
    );
}

export default function LargeCollectorLayout({
    children    
}: {
    children: React.ReactNode;
}) {
    return (
        <NotificationProvider>
            <UserProvider>
                <CollectorProvider>
                    <SmallCollectionProvider>
                        <ProductQueryProvider>
                            <ShiftProvider>
                                <VehicleProvider>
                                    <SettingGroupProvider>
                                        <CapacityProvider>
                                            <LayoutContent>{children}</LayoutContent>
                                        </CapacityProvider>
                                    </SettingGroupProvider>
                                </VehicleProvider>
                            </ShiftProvider>
                        </ProductQueryProvider>
                    </SmallCollectionProvider>
                </CollectorProvider>
            </UserProvider>
        </NotificationProvider>
    );
}
