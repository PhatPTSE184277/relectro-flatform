'use client';

import Header from '@/components/ui/Header';
import Sidebar from '@/components/ui/Sidebar';
import Toast from '@/components/ui/Toast';
import { recyclerMenuItems } from '@/constants/recycle/MenuItems';
import { RecyclerPackageProvider } from '@/contexts/recycle/PackageContext';
import { QRProvider } from '@/contexts/recycle/QRContext';
import { NotificationProvider, useNotifications } from '@/contexts/NotificationContext';
import { UserProvider } from '@/contexts/UserContext';
import { CategoryProvider } from '@/contexts/recycle/CategoryContext';

function LayoutContent({ children }: { children: React.ReactNode }) {
    const { toast, hideToast } = useNotifications();

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
                open={!!toast} 
                type={toast?.type} 
                message={toast?.message || ''} 
                onClose={hideToast}
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
        <UserProvider>
            <NotificationProvider>
                <QRProvider>
                    <RecyclerPackageProvider>
                        <CategoryProvider>
                            <LayoutContent>{children}</LayoutContent>
                        </CategoryProvider>
                    </RecyclerPackageProvider>
                </QRProvider>
            </NotificationProvider>
        </UserProvider>
    );
}
