import Header from '@/components/ui/Header';
import Sidebar from '@/components/ui/Sidebar';
import { collectorMenuItems } from '@/constants/small-collector/MenuItems';
import { CategoryProvider } from '@/contexts/small-collector/CategoryContext';
import { CollectionRouteProvider } from '@/contexts/small-collector/CollectionRouteContext';
import { IWProductProvider } from '@/contexts/small-collector/IWProductContext';
import { PackageProvider } from '@/contexts/small-collector/PackageContext';
import { PostProvider } from '@/contexts/small-collector/PostContext';
import { UserProvider } from '@/contexts/UserContext';

export default function SmallCollectorLayout({
    children
}: {
    children: React.ReactNode;
}) {
    return (
        <PostProvider>
            <CollectionRouteProvider>
                <IWProductProvider>
                    <PackageProvider>
                        <UserProvider>
                            <CategoryProvider>
                                <div className='h-screen flex flex-col bg-gray-50'>
                                    <Header 
                                        title="Bảng điều khiển thu gom" 
                                        href="/small-collector/dashboard" 
                                        profileHref="/employee/profile" 
                                    />
                                    <div className='flex flex-1 overflow-hidden'>
                                        <Sidebar menuItems={collectorMenuItems} />
                                        <main className='flex-1 overflow-y-auto'>
                                            {children}
                                        </main>
                                    </div>
                                </div>
                            </CategoryProvider>
                        </UserProvider>
                    </PackageProvider>
                </IWProductProvider>
            </CollectionRouteProvider>
        </PostProvider>
    );
}
