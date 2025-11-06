import Header from '@/components/collector/Header';
import Sidebar from '@/components/collector/Sidebar';
import { CollectionRouteProvider } from '@/contexts/collector/CollectionRouteContext';
import { PostProvider } from '@/contexts/collector/PostContext';

export default function ColectorLayout({
    children
}: {
    children: React.ReactNode;
}) {
    return (
        <PostProvider>
            <CollectionRouteProvider>
                <div className='h-screen flex flex-col bg-gray-50'>
                    <Header />
                    <div className='flex flex-1 overflow-hidden'>
                        <Sidebar />
                        <main className='flex-1 overflow-y-auto'>
                            {children}
                        </main>
                    </div>
                </div>
            </CollectionRouteProvider>
        </PostProvider>
    );
}
