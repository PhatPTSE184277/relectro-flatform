import Header from '@/components/small-collector/Header';
import Sidebar from '@/components/small-collector/Sidebar';
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
                                    <Header />
                                    <div className='flex flex-1 overflow-hidden'>
                                        <Sidebar />
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
