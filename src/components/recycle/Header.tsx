'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { IoSparklesOutline } from 'react-icons/io5';

type User = {
    name?: string;
};

const getMe = async (): Promise<User | null> => {
    if (typeof window !== 'undefined') {
        const authData = localStorage.getItem('authData');
        if (authData) {
            try {
                const { user } = JSON.parse(authData);
                return user;
            } catch {
                return null;
            }
        }
    }
    return null;
};

const Header = () => {
    const router = useRouter();
    const pathname = usePathname();
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            const userInfo = await getMe();
            setUser(userInfo);
        };
        fetchUser();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('authData');
        setUser(null);
        router.push('/');
    };

    const handleReload = (
        e: React.MouseEvent<HTMLAnchorElement>
    ) => {
        if (pathname === '/recycle/dashboard') {
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
                            href='/recycle/dashboard'
                            className='text-2xl font-bold bg-linear-to-r from-primary-500 to-primary-400 bg-clip-text text-transparent flex items-center gap-2 cursor-pointer'
                            onClick={handleReload}
                        >
                            <IoSparklesOutline className='text-primary-400 text-2xl' />
                            Bảng điều khiển tái chế
                        </Link>
                    </div>

                    <div className='flex items-center space-x-4'>
                        {user && (
                            <>
                                <div className='flex items-center gap-2 px-3 py-1.5 bg-primary-50 rounded-full border border-primary-100'>
                                    <div className='w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center text-white font-semibold text-sm'>
                                        {user.name?.charAt(0).toUpperCase() || 'U'}
                                    </div>
                                    <span className='text-sm font-medium text-gray-700'>
                                        {user.name || 'Recycler'}
                                    </span>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className='px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition cursor-pointer'
                                >
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
