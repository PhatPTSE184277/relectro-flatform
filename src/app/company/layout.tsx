import Header from '@/components/ui/Header';
import Sidebar from '@/components/ui/Sidebar';
import { MenuItems } from '@/constants/company/MenuItems';
import { CollectorProvider } from '@/contexts/company/CollectorContext';
import { SmallCollectionProvider } from '@/contexts/company/SmallCollectionContext';
import { ProductQueryProvider } from '@/contexts/company/ProductQueryContext';

export default function LargeCollectorLayout({
    children    
}: {
    children: React.ReactNode;
}) {
    return (
        <CollectorProvider>
            <SmallCollectionProvider>
                <ProductQueryProvider>
                    <div className='h-screen flex flex-col bg-gray-50'>
                        <Header 
                            title="Bảng điều khiển thu gom lớn" 
                            href="/large-collector/dashboard" 
                            profileHref="/employee/profile" 
                        />
                        <div className='flex flex-1 overflow-hidden'>
                            <Sidebar menuItems={MenuItems} />
                            <main className='flex-1 overflow-y-auto'>{children}</main>
                        </div>
                    </div>
                </ProductQueryProvider>
            </SmallCollectionProvider>
        </CollectorProvider>
    );
}
