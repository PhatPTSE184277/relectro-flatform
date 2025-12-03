import Header from '@/components/ui/Header';
import Sidebar from '@/components/ui/Sidebar';
import { recyclerMenuItems } from '@/constants/recycle/MenuItems';
import { RecyclerPackageProvider } from '@/contexts/recycle/PackageContext';

export default function RecycleLayout({
    children
}: {
    children: React.ReactNode;
}) {
    return (
        <RecyclerPackageProvider>
            <div className='h-screen flex flex-col bg-gray-50'>
                <Header 
                    title="Bảng điều khiển tái chế" 
                    href="/recycle/dashboard" 
                    profileHref="/recycle/profile" 
                />
                <div className='flex flex-1 overflow-hidden'>
                    <Sidebar menuItems={recyclerMenuItems} />
                    <main className='flex-1 overflow-y-auto'>
                        {children}
                    </main>
                </div>
            </div>
        </RecyclerPackageProvider>
    );
}
