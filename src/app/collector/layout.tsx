import Header from '@/components/collector/Header';
import Sidebar from '@/components/collector/Sidebar';
import { CategoryProvider } from '@/contexts/collector/CategoryContext';
import { CollectionRouteProvider } from '@/contexts/collector/CollectionRouteContext';
import { IWProductProvider } from '@/contexts/collector/IWProductContext';
import { PackageProvider } from '@/contexts/collector/PackageContext';
import { PostProvider } from '@/contexts/collector/PostContext';

export default function ColectorLayout({
    children
}: {
    children: React.ReactNode;
}) {
    return (
        <PostProvider>
            <CollectionRouteProvider>
                <IWProductProvider>
                    <PackageProvider>
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
                    </PackageProvider>
                </IWProductProvider>
            </CollectionRouteProvider>
        </PostProvider>
    );
}
