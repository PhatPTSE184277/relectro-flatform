'use client';

import React from 'react';
import { NotificationProvider } from '@/contexts/NotificationContext';
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

export default function CollectionPointLayout({ children }: { children: React.ReactNode }) {
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
                                                                            {children}
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

