import Header from '@/components/ui/Header';
import Sidebar from '@/components/ui/Sidebar';
import { adminMenuItems } from '@/constants/admin/MenuItem';
import { UserProvider } from '@/contexts/admin/UserContext';
import { CollectionCompanyProvider } from '@/contexts/admin/CollectionCompanyContext';
import { PostProvider } from '@/contexts/admin/PostContext';
import { SystemConfigProvider } from '@/contexts/admin/SystemConfigContext';
import { TrackingProvider } from '@/contexts/admin/TrackingContext';
import { CompanyConfigProvider } from '@/contexts/admin/CompanyConfigContext';
import { AssignProductProvider } from '@/contexts/admin/AssignProductContext';
import { AssignRecyclingProvider } from '@/contexts/admin/AssignRecyclingContext';
import { DashboardProvider } from '@/contexts/admin/DashboardContext';
import { AssignedProductProvider } from '@/contexts/admin/AssignedProductContext';

export default function AdminLayout({
    children
}: {
    children: React.ReactNode;
}) {
    return (
        <AssignedProductProvider>
            <AssignRecyclingProvider>
                <AssignProductProvider>
                    <CompanyConfigProvider>
                    <PostProvider>
                        <UserProvider>
                            <CollectionCompanyProvider>
                                <SystemConfigProvider>
                                    <TrackingProvider>
                                        <DashboardProvider>
                                            <div className='h-screen flex flex-col bg-gray-50'>
                                                <Header
                                                    title='Bảng điều khiển quản trị'
                                                    href='/admin/dashboard'
                                                    profileHref='/admin/profile'
                                                />
                                                <div className='flex flex-1 overflow-hidden'>
                                                    <Sidebar
                                                        menuItems={adminMenuItems}
                                                    />
                                                    <main className='flex-1 overflow-y-auto'>
                                                        {children}
                                                    </main>
                                                </div>
                                            </div>
                                        </DashboardProvider>
                                    </TrackingProvider>
                                </SystemConfigProvider>
                            </CollectionCompanyProvider>
                        </UserProvider>
                    </PostProvider>
                </CompanyConfigProvider>
            </AssignProductProvider>
        </AssignRecyclingProvider>
        </AssignedProductProvider>
    );
}
