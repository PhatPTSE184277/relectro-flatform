"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import { IoCloseOutline } from "react-icons/io5";

interface MenuItem {
    id: string;
    label: string;
    path: string;
    icon: ReactNode;
}

interface SidebarProps {
    menuItems: MenuItem[];
    colorScheme?: 'primary' | 'blue';
    isOpen?: boolean;
    onClose?: () => void;
}

const Sidebar = ({ menuItems, isOpen = true, onClose }: SidebarProps) => {
    const pathname = usePathname();

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && onClose && (
                <div 
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={onClose}
                />
            )}
            
            {/* Sidebar */}
            <aside className={`
                fixed lg:relative top-0 left-0 h-full
                w-64 sm:w-72 md:w-80 lg:w-64
                bg-white border-r border-gray-100 flex flex-col shadow-lg overflow-y-auto
                transition-transform duration-300 ease-in-out z-50
                ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                {/* Close button for mobile */}
                {onClose && (
                    <div className="lg:hidden flex justify-end p-3 border-b border-gray-100">
                        <button
                            onClick={onClose}
                            className="p-2 rounded-lg hover:bg-gray-100 transition"
                            aria-label="Close menu"
                        >
                            <IoCloseOutline size={24} className="text-gray-600" />
                        </button>
                    </div>
                )}

                <nav className="flex-1 p-3 sm:p-4 space-y-1.5 sm:space-y-2">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.path;
                        return (
                            <Link
                                key={item.label}
                                href={item.path}
                                onClick={() => onClose && onClose()}
                                className={`flex items-center gap-2.5 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg text-sm sm:text-base font-medium transition-all duration-400 group
                                    ${isActive
                                        ? "bg-primary-50 text-primary-700 shadow-lg"
                                        : "text-gray-600 hover:text-primary-700 hover:bg-primary-50 hover:shadow"
                                    }
                                `}
                            >
                                <span
                                    className={`text-base sm:text-lg transition-colors duration-400 ${isActive ? "text-primary-500" : "text-gray-400 group-hover:text-primary-500"}`}
                                >
                                    {item.icon}
                                </span>
                                <span className="truncate">{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>
            </aside>
        </>
    );
};

export default Sidebar;
