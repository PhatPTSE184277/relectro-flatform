'use client';

import Header from '@/components/ui/Header';
import Sidebar from '@/components/ui/Sidebar';
import Toast from '@/components/ui/Toast';
import { shipperMenuItems } from '@/constants/shipper/MenuItems';
import { ShipperPackageProvider } from '@/contexts/shipper/PackageContext';
import { NotificationProvider, useNotifications } from '@/contexts/NotificationContext';

function LayoutContent({ children }: { children: React.ReactNode }) {
    const { toast, hideToast } = useNotifications();

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
                open={!!toast} 
                type={toast?.type} 
                message={toast?.message || ''} 
                onClose={hideToast}
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
