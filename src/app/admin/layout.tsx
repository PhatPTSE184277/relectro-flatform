'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/ui/Header';
import Sidebar from '@/components/ui/Sidebar';
import Toast from '@/components/ui/Toast';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { adminMenuItems } from '@/constants/admin/MenuItem';
import { UserProvider } from '@/contexts/admin/UserContext';
import { CollectionCompanyProvider } from '@/contexts/admin/CompanyContext';
import { RequestProvider } from '@/contexts/admin/RequestContext';
import { SystemConfigProvider } from '@/contexts/admin/SystemConfigContext';
import { TrackingProvider } from '@/contexts/admin/TrackingContext';
import { CompanyConfigProvider } from '@/contexts/admin/CompanyConfigContext';
import { DistributeProductProvider } from '@/contexts/admin/DistributeProductContext';
import { AssignRecyclingProvider } from '@/contexts/admin/AssignRecyclingContext';
import { DashboardProvider } from '@/contexts/admin/DashboardContext';
import { SendNotiProvider } from '@/contexts/admin/SendNotiContext';
import { SpeedProvider } from '@/contexts/admin/SpeedContext';
import { CapacityProvider } from '@/contexts/admin/CapacityContext';
import { VoucherProvider } from '@/contexts/admin/VoucherContext';
import { CategoryProvider } from '@/contexts/admin/CategoryContext';
import { NotificationProvider, useNotifications } from '@/contexts/NotificationContext';

function AdminLayoutContent({ children, sidebarOpen, setSidebarOpen }: { children: React.ReactNode; sidebarOpen: boolean; setSidebarOpen: (open: boolean) => void }) {
    const { toast, hideToast } = useNotifications();

    return (
        <>
            <ProtectedRoute>
                <div className='h-screen flex flex-col bg-gray-50'>
                    <Header
                        title='Bảng điều khiển quản trị'
                        href='/admin/dashboard'
                        profileHref='/admin/profile'
                        onMenuClick={() => setSidebarOpen(!sidebarOpen)}
                    />
                    <div className='flex flex-1 overflow-hidden'>
                        <div className={`h-full ${sidebarOpen ? 'block' : 'hidden'} xl:block`}>
                            <Sidebar
                                menuItems={adminMenuItems}
                                isOpen={sidebarOpen}
                                onClose={() => setSidebarOpen(false)}
                            />
                        </div>
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
            </ProtectedRoute>
        </>
    );
}

export default function AdminLayout({
    children
}: {
    children: React.ReactNode;
}) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1280) {
                setSidebarOpen(true);
            } else {
                setSidebarOpen(false);
            }
        };

        handleResize(); // Set initial state
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <NotificationProvider>
            <SendNotiProvider>
                <SpeedProvider>
                    <AssignRecyclingProvider>
                        <DistributeProductProvider>
                            <CompanyConfigProvider>
                            <RequestProvider>
                                <UserProvider>
                                    <CollectionCompanyProvider>
                                        <SystemConfigProvider>
                                            <TrackingProvider>
                                                <CategoryProvider>
                                                    <DashboardProvider>
                                                        <CapacityProvider>
                                                            <VoucherProvider>
                                                                <AdminLayoutContent sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}>
                                                                    {children}
                                                                </AdminLayoutContent>
                                                            </VoucherProvider>
                                                        </CapacityProvider>
                                                    </DashboardProvider>
                                                </CategoryProvider>
                                            </TrackingProvider>
                                        </SystemConfigProvider>
                                    </CollectionCompanyProvider>
                                </UserProvider>
                            </RequestProvider>
                        </CompanyConfigProvider>
                    </DistributeProductProvider>
                </AssignRecyclingProvider>
            </SpeedProvider>
        </SendNotiProvider>
        </NotificationProvider>
    );
}
