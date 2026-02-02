'use client';


import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { IoLogOutOutline, IoSparklesOutline, IoChevronDownOutline, IoPersonOutline, IoNotificationsOutline, IoMenuOutline } from 'react-icons/io5';
import { useState, useRef, useEffect } from 'react';
import { useAppDispatch } from '@/redux/hooks';
import { logout } from '@/redux/reducers/authReducer';
import { useAuth } from '@/hooks/useAuth';
import { useNotifications } from '@/contexts/NotificationContext';


interface HeaderProps {
    title?: string;
    href?: string;
    profileHref?: string;
    onMenuClick?: () => void;
}


const Header = ({ title, href, profileHref, onMenuClick }: HeaderProps) => {
    const router = useRouter();
    const pathname = usePathname();
    const dispatch = useAppDispatch();
    const { user, isAuthenticated } = useAuth();
    const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const notifDropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!dropdownOpen) return;
        const handleClick = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, [dropdownOpen]);

    useEffect(() => {
        if (!notifDropdownOpen) return;
        const handleClick = (e: MouseEvent) => {
            if (notifDropdownRef.current && !notifDropdownRef.current.contains(e.target as Node)) {
                setNotifDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, [notifDropdownOpen]);

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
            <div className='max-w-full px-3 sm:px-4 md:px-6 lg:px-8'>
                <div className='flex justify-between items-center h-14 sm:h-16'>
                    <div className='flex items-center space-x-2 sm:space-x-4 md:space-x-8'>
                        {/* Hamburger Menu Button */}
                        {onMenuClick && (
                            <button
                                onClick={onMenuClick}
                                className='xl:hidden p-2 rounded-lg hover:bg-primary-50 transition'
                                aria-label='Toggle menu'
                            >
                                <IoMenuOutline className='text-gray-700' size={24} />
                            </button>
                        )}
                        <Link
                            href={finalHref ?? '/'}
                            className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold bg-linear-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent flex items-center gap-1.5 sm:gap-2 cursor-pointer whitespace-nowrap"
                            onClick={handleReload}
                        >
                            <IoSparklesOutline className="text-primary-400 text-lg sm:text-xl md:text-2xl shrink-0" />
                            <span className='truncate max-w-[150px] sm:max-w-[200px] md:max-w-none'>{finalTitle}</span>
                        </Link>
                    </div>

                    <div className='flex items-center space-x-1.5 sm:space-x-3 md:space-x-4'>
                        {isAuthenticated && user && (
                            <>
                                {/* Notification Bell: For Admin, AdminWarehouse, AdminCompany, RecyclingCompany */}
                                {['Admin', 'AdminWarehouse'].includes(user.role) && (
                                    <div className='relative' ref={notifDropdownRef}>
                                        <button
                                            onClick={() => setNotifDropdownOpen((v) => !v)}
                                            className='relative p-1.5 sm:p-2 rounded-full hover:bg-primary-50 transition cursor-pointer'
                                        >
                                            <IoNotificationsOutline className='text-gray-700' size={20} />
                                            {unreadCount > 0 && (
                                                <span className='absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-red-500 text-white text-[10px] sm:text-xs font-bold rounded-full flex items-center justify-center animate-pulse'>
                                                    {unreadCount > 9 ? '9+' : unreadCount}
                                                </span>
                                            )}
                                        </button>

                                        {/* Notification Dropdown */}
                                        {notifDropdownOpen && (
                                            <div className='absolute right-0 mt-2 w-[calc(100vw-2rem)] sm:w-96 bg-white border border-primary-200 rounded-2xl shadow-2xl z-50 animate-fade-in overflow-hidden max-h-[500px] flex flex-col'>
                                                {/* Header */}
                                                <div className='flex items-center justify-between p-4 border-b border-primary-100 bg-primary-50'>
                                                    <h3 className='font-bold text-gray-900'>Thông báo</h3>
                                                    {unreadCount > 0 && (
                                                        <button
                                                            onClick={markAllAsRead}
                                                            className='text-xs text-primary-600 hover:text-primary-700 font-medium'
                                                        >
                                                            Đánh dấu tất cả đã đọc
                                                        </button>
                                                    )}
                                                </div>

                                                {/* Notification List */}
                                                <div className='overflow-y-auto flex-1'>
                                                    {notifications.length === 0 ? (
                                                        <div className='p-8 text-center text-gray-400'>
                                                            <IoNotificationsOutline className='mx-auto mb-2' size={48} />
                                                            <p>Không có thông báo</p>
                                                        </div>
                                                    ) : (
                                                        notifications.map((notif) => (
                                                            <div
                                                                key={notif.notificationId}
                                                                onClick={() => !notif.isRead && markAsRead(notif.notificationId)}
                                                                className={`p-4 border-b border-primary-50 cursor-pointer transition ${
                                                                    notif.isRead ? 'bg-white hover:bg-gray-50' : 'bg-primary-50/50 hover:bg-primary-50'
                                                                }`}
                                                            >
                                                                <div className='flex items-start gap-3'>
                                                                    <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${
                                                                        notif.isRead ? 'bg-gray-300' : 'bg-primary-600'
                                                                    }`} />
                                                                    <div className='flex-1 min-w-0'>
                                                                        <h4 className={`text-sm font-semibold mb-1 ${
                                                                            notif.isRead ? 'text-gray-700' : 'text-gray-900'
                                                                        }`}>
                                                                            {notif.title}
                                                                        </h4>
                                                                        <p className='text-sm text-gray-600 line-clamp-2'>
                                                                            {notif.message}
                                                                        </p>
                                                                        <p className='text-xs text-gray-400 mt-1'>
                                                                            {new Date(notif.createdAt).toLocaleString('vi-VN')}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* User Avatar Dropdown */}
                                <div className='relative' ref={dropdownRef}>
                                <div
                                    className={
                                        `flex items-center space-x-1.5 sm:space-x-2 md:space-x-3 bg-white border border-primary-100 rounded-full px-2 sm:px-3 py-1 sm:py-1.5 shadow cursor-pointer hover:shadow-lg transition min-w-10 sm:min-w-12 relative group ${dropdownOpen ? 'ring-2 ring-primary-300 border-primary-300' : ''}`
                                    }
                                    onClick={() => setDropdownOpen((v) => !v)}
                                >
                                    <div className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 rounded-full bg-linear-to-tr from-primary-600 to-primary-400 text-white flex items-center justify-center font-bold text-sm sm:text-base md:text-lg shadow ring-2 ring-primary-200 border-2 border-white">
                                        {user.name?.charAt(0).toUpperCase() || 'U'}
                                    </div>
                                    <span 
                                        className='hidden md:block text-sm md:text-base font-semibold text-gray-800 pr-1 truncate max-w-[100px] lg:max-w-[150px] overflow-hidden' 
                                        title={user.name}
                                    >
                                        {user.name}
                                    </span>
                                    <IoChevronDownOutline className={`hidden sm:block text-primary-400 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} size={18} />
                                </div>
                                {dropdownOpen && (
                                    <>
                                        {/* Dropdown menu */}
                                        <div className="absolute right-0 mt-3 w-56 sm:w-64 bg-white/95 border border-primary-200 rounded-2xl shadow-2xl z-50 animate-fade-in overflow-hidden backdrop-blur-sm">
                                            <div className="flex flex-col divide-y divide-primary-50">
                                                <button
                                                    onClick={() => {
                                                        setDropdownOpen(false);
                                                        router.push(finalProfileHref);
                                                    }}
                                                    className='w-full flex items-center gap-3 text-left px-6 py-4 hover:bg-primary-50/80 text-gray-800 text-base font-semibold transition-colors duration-150 focus:outline-none'
                                                >
                                                    <IoPersonOutline className='text-primary-400' size={22} />
                                                    Trang cá nhân
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setDropdownOpen(false);
                                                        handleLogout();
                                                    }}
                                                    className='w-full flex items-center gap-3 text-left px-6 py-4 hover:bg-red-50/80 text-red-600 text-base font-semibold transition-colors duration-150 focus:outline-none'
                                                >
                                                    <IoLogOutOutline />
                                                    Đăng xuất
                                                </button>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Header;
