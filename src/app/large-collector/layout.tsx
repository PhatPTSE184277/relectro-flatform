import Header from '@/components/small-collector/Header';
import Sidebar from '@/components/small-collector/Sidebar';

export default function LargeCollectorLayout({
    children
}: {
    children: React.ReactNode;
}) {
    return (
        <div className='h-screen flex flex-col bg-gray-50'>
            <Header />
            <div className='flex flex-1 overflow-hidden'>
                <Sidebar />
                <main className='flex-1 overflow-y-auto'>{children}</main>
            </div>
        </div>
    );
}
