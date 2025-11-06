'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { IoLogOutOutline, IoSparklesOutline } from 'react-icons/io5';
import { useEffect, useState } from 'react';

type User = {
    name?: string;
};

const getMe = async (): Promise<User | null> => {
    // Lấy user từ localStorage (hoặc gọi API nếu cần)
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

    const handleReloadIfEmployeeHome = (
        e: React.MouseEvent<HTMLAnchorElement>
    ) => {
        if (pathname === '/employee/tasks') {
            e.preventDefault();
            window.location.reload();
        }
    };

    return (
        <nav className='bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50'>
            <div className='max-w-full px-6 lg:px-8'>
                <div className='flex justify-between items-center h-16'>
                    <div className='flex items-center space-x-8'>
                        <Link
                            href='/employee/tasks'
                            className='text-2xl font-bold bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent flex items-center gap-2 cursor-pointer'
                            onClick={handleReloadIfEmployeeHome}
                        >
                            <IoSparklesOutline className='text-purple-400 text-2xl' />
                            Collector Panel
                        </Link>
                    </div>

                    <div className='flex items-center space-x-4'>
                        {user && (
                            <>
                                <div
                                    className='flex items-center space-x-3 bg-white border border-blue-100 rounded-xl px-4 py-2 shadow cursor-pointer hover:shadow-md transition'
                                    onClick={() =>
                                        router.push('/employee/profile')
                                    }
                                >
                                    <div className='w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-blue-400 text-white flex items-center justify-center font-bold text-sm ring-2 ring-blue-200'>
                                        {user.name?.charAt(0).toUpperCase()}
                                    </div>
                                    <span className='hidden sm:block text-sm font-medium text-gray-700'>
                                        {user.name}
                                    </span>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className='flex items-center gap-2 text-gray-700 hover:text-red-600 text-sm font-medium transition-colors px-4 py-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-100 cursor-pointer'
                                >
                                    <IoLogOutOutline />
                                    Logout
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
