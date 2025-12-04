'use client';


import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { IoLogOutOutline, IoSparklesOutline } from 'react-icons/io5';
import { useAppDispatch } from '@/redux/hooks';
import { logout } from '@/redux/reducers/authReducer';
import { useAuth } from '@/hooks/useAuth';


interface HeaderProps {
    title?: string;
    href?: string;
    profileHref?: string;
}


const Header = ({ title, href, profileHref }: HeaderProps) => {
    const router = useRouter();
    const pathname = usePathname();
    const dispatch = useAppDispatch();
    const { user, isAuthenticated } = useAuth();

    const handleLogout = () => {
        dispatch(logout());
        router.push('/');
    };

    // Sử dụng props truyền vào, không tự động lấy từ pathname nữa
    const finalTitle = title;
    const finalHref = href;
    const finalProfileHref = profileHref ?? '/';

    const handleReload = (e: React.MouseEvent<HTMLAnchorElement>) => {
        if (pathname === finalHref) {
            e.preventDefault();
            window.location.reload();
        }
    };

    return (
        <nav className='bg-white shadow-sm sticky top-0 z-50'>
            <div className='max-w-full px-6 lg:px-8'>
                <div className='flex justify-between items-center h-16'>
                    <div className='flex items-center space-x-8'>
                        <Link
                            href={finalHref ?? '/'}
                            className="text-2xl font-bold bg-linear-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent flex items-center gap-2 cursor-pointer"
                            onClick={handleReload}
                        >
                            <IoSparklesOutline className="text-primary-400 text-2xl" />
                            {finalTitle}
                        </Link>
                    </div>

                    <div className='flex items-center space-x-4'>
                        {isAuthenticated && user && (
                            <>
                                <div
                                    className="flex items-center space-x-3 bg-white border border-primary-100 rounded-xl px-4 py-2 shadow cursor-pointer hover:shadow-md transition"
                                    onClick={() => router.push(finalProfileHref)}
                                >
                                    <div className="w-8 h-8 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold text-sm ring-2 ring-primary-200">
                                        {user.name?.charAt(0).toUpperCase() || 'U'}
                                    </div>
                                    <span className='hidden sm:block text-sm font-medium text-gray-700'>
                                        {user.name}
                                    </span>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className='flex items-center gap-2 text-primary-600 hover:text-primary-700 text-sm font-medium transition-colors px-4 py-2 rounded-xl border border-primary-100 bg-white hover:bg-primary-50 cursor-pointer'
                                >
                                    <IoLogOutOutline />
                                    Đăng xuất
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Header;
