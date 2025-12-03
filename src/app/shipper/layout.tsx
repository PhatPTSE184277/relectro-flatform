import Header from '@/components/ui/Header';
import Sidebar from '@/components/ui/Sidebar';
import { shipperMenuItems } from '@/constants/shipper/MenuItems';
import { ShipperPackageProvider } from '@/contexts/shipper/PackageContext';

export default function ShipperLayout({
    children
}: {
    children: React.ReactNode;
}) {
    return (
        <ShipperPackageProvider>
            <div className='h-screen flex flex-col bg-gray-50'>
                <Header 
                    title="Bảng điều khiển vận chuyển" 
                    href="/shipper/dashboard" 
                    profileHref="/shipper/profile" 
                />
                <div className='flex flex-1 overflow-hidden'>
                    <Sidebar menuItems={shipperMenuItems} />
                    <main className='flex-1 overflow-y-auto'>
                        {children}
                    </main>
                </div>
            </div>
        </ShipperPackageProvider>
    );
}
