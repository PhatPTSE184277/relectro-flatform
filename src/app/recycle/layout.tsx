import Header from '@/components/recycle/Header';
import Sidebar from '@/components/recycle/Sidebar';
import { RecyclerPackageProvider } from '@/contexts/recycle/PackageContext';

export default function RecycleLayout({
    children
}: {
    children: React.ReactNode;
}) {
    return (
        <RecyclerPackageProvider>
            <div className='h-screen flex flex-col bg-gray-50'>
                <Header />
                <div className='flex flex-1 overflow-hidden'>
                    <Sidebar />
                    <main className='flex-1 overflow-y-auto'>
                        {children}
                    </main>
                </div>
            </div>
        </RecyclerPackageProvider>
    );
}
