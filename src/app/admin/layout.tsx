import Header from '@/components/ui/Header';
import Sidebar from '@/components/ui/Sidebar';
import { adminMenuItems } from '@/constants/admin/MenuItem';
import { UserProvider } from '@/contexts/admin/UserContext';
import { CollectionCompanyProvider } from '@/contexts/admin/CollectionCompanyContext';
import { PostProvider } from '@/contexts/admin/PostContext';

export default function AdminLayout({
    children
}: {
    children: React.ReactNode;
}) {
    return (
        <PostProvider>
            <UserProvider>
                <CollectionCompanyProvider>
                    <div className='h-screen flex flex-col bg-gray-50'>
                        <Header
                            title='Bảng điều khiển quản trị'
                            href='/admin/dashboard'
                            profileHref='/admin/profile'
                        />
                        <div className='flex flex-1 overflow-hidden'>
                            <Sidebar menuItems={adminMenuItems} />
                            <main className='flex-1 overflow-y-auto'>
                                {children}
                            </main>
                        </div>
                    </div>
                </CollectionCompanyProvider>
            </UserProvider>
        </PostProvider>
    );
}
