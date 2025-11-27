import Header from '@/components/shipper/Header';
import Sidebar from '@/components/shipper/Sidebar';
import { ShipperPackageProvider } from '@/contexts/shipper/PackageContext';

export default function ShipperLayout({
    children
}: {
    children: React.ReactNode;
}) {
    return (
        <ShipperPackageProvider>
            <div className='h-screen flex flex-col bg-gray-50'>
                <Header />
                <div className='flex flex-1 overflow-hidden'>
                    <Sidebar />
                    <main className='flex-1 overflow-y-auto'>
                        {children}
                    </main>
                </div>
            </div>
        </ShipperPackageProvider>
    );
}
