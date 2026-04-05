 'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/ui/Header';
import Sidebar from '@/components/ui/Sidebar';
import Toast from '@/components/ui/Toast';
import { collectorMenuItems } from '@/constants/collection-point/MenuItems';
import { NotificationProvider, useNotifications } from '@/contexts/NotificationContext';
import { UserProvider } from '@/contexts/UserContext';
import { CollectorProvider } from '@/contexts/collection-point/CollectorContext';
import { SmallCollectionProvider } from '@/contexts/company/SmallCollectionContext';
import { ProductQueryProvider } from '@/contexts/collection-point/ProductQueryContext';
import { GroupingProvider } from '@/contexts/collection-point/GroupingContext';
import { CollectionRouteProvider } from '@/contexts/collection-point/CollectionRouteContext';
import { IWProductProvider } from '@/contexts/collection-point/IWProductContext';
import { PackageProvider } from '@/contexts/collection-point/PackageContext';
import { SmallCollectorQRProvider } from '@/contexts/collection-point/QRContext';
import { CategoryProvider } from '@/contexts/collection-point/CategoryContext';
import { DashboardProvider } from '@/contexts/collection-point/DashboardContext';
import { SeedQRCodeProvider } from '@/contexts/collection-point/SeedQRCodeContext';
import { VehicleProvider } from '@/contexts/collection-point/VehicleContext';
import { ShiftProvider } from '@/contexts/collection-point/ShiftContext';
import { SettingGroupProvider } from '@/contexts/collection-point/SettingGroupContext';
import { CapacityProvider } from '@/contexts/collection-point/CapacityContext';

function CollectionPointLayoutContent({ children, sidebarOpen, setSidebarOpen }: { children: React.ReactNode; sidebarOpen: boolean; setSidebarOpen: (open: boolean) => void }) {
    const { toast, hideToast } = useNotifications();

    return (
        <>
            <div className='h-screen flex flex-col bg-gray-50'>
                <Header
                    title='Ewise'
                    href='/collection-point/dashboard'
                    profileHref='/collection-point/profile'
                    onMenuClick={() => setSidebarOpen(!sidebarOpen)}
                />
                <div className='flex flex-1 overflow-hidden'>
                    <div className={`h-full ${sidebarOpen ? 'block' : 'hidden'} xl:block`}>
                        <Sidebar
                            menuItems={collectorMenuItems}
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
        </>
    );
}

export default function CollectionPointLayout({ children }: { children: React.ReactNode }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1280) {
                setSidebarOpen(true);
            } else {
                setSidebarOpen(false);
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <NotificationProvider>
            <UserProvider>
                <CollectorProvider>
                    <SmallCollectionProvider>
                        <ProductQueryProvider>
                            <GroupingProvider>
                                <CollectionRouteProvider>
                                    <IWProductProvider>
                                        <PackageProvider>
                                            <SmallCollectorQRProvider>
                                                <CategoryProvider>
                                                    <DashboardProvider>
                                                        <SeedQRCodeProvider>
                                                            <VehicleProvider>
                                                                <ShiftProvider>
                                                                    <SettingGroupProvider>
                                                                        <CapacityProvider>
                                                                            <CollectionPointLayoutContent sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}>
                                                                                {children}
                                                                            </CollectionPointLayoutContent>
                                                                        </CapacityProvider>
                                                                    </SettingGroupProvider>
                                                                </ShiftProvider>
                                                            </VehicleProvider>
                                                        </SeedQRCodeProvider>
                                                    </DashboardProvider>
                                                </CategoryProvider>
                                            </SmallCollectorQRProvider>
                                        </PackageProvider>
                                    </IWProductProvider>
                                </CollectionRouteProvider>
                            </GroupingProvider>
                        </ProductQueryProvider>
                    </SmallCollectionProvider>
                </CollectorProvider>
            </UserProvider>
        </NotificationProvider>
    );
}

