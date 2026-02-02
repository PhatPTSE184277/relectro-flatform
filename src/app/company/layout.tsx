'use client';

import Header from '@/components/ui/Header';
import Sidebar from '@/components/ui/Sidebar';
import Toast from '@/components/ui/Toast';
import { MenuItems } from '@/constants/company/MenuItems';
import { CollectorProvider } from '@/contexts/company/CollectorContext';
import { SmallCollectionProvider } from '@/contexts/company/SmallCollectionContext';
import { ProductQueryProvider } from '@/contexts/company/ProductQueryContext';
import { ShiftProvider } from '@/contexts/company/ShiftContext';
import { VehicleProvider } from '@/contexts/company/VehicleContext';
import { SettingGroupProvider } from '@/contexts/company/SettingGroupContext';
import { NotificationProvider, useNotifications } from '@/contexts/NotificationContext';

function LayoutContent({ children }: { children: React.ReactNode }) {
    const { toast, hideToast } = useNotifications();

    return (
        <>
            <div className='h-screen flex flex-col bg-gray-50'>
                <Header 
                    title="Bảng điều khiển thu gom lớn" 
                    href="/large-collector/dashboard" 
                    profileHref="/employee/profile" 
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
            <CollectorProvider>
                <SmallCollectionProvider>
                    <ProductQueryProvider>
                        <ShiftProvider>
                            <VehicleProvider>
                                <SettingGroupProvider>
                                    <LayoutContent>{children}</LayoutContent>
                                </SettingGroupProvider>
                            </VehicleProvider>
                        </ShiftProvider>
                    </ProductQueryProvider>
                </SmallCollectionProvider>
            </CollectorProvider>
        </NotificationProvider>
    );
}
