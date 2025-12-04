"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

interface MenuItem {
    id: string;
    label: string;
    path: string;
    icon: ReactNode;
}

interface SidebarProps {
    menuItems: MenuItem[];
    colorScheme?: 'primary' | 'blue';
}

const Sidebar = ({ menuItems}: SidebarProps) => {
    const pathname = usePathname();

    return (
        <aside className="w-64 h-full bg-white border-r border-gray-100 flex flex-col shadow-lg overflow-y-auto">
            <nav className="flex-1 p-4 space-y-2">
                {menuItems.map((item) => {
                    const isActive = pathname === item.path;
                    return (
                        <Link
                            key={item.label}
                            href={item.path}
                            className={`flex items-center gap-3 px-4 py-2 rounded-lg text-base font-medium transition-all duration-400 group
                                ${isActive
                                    ? "bg-primary-50 text-primary-700 shadow border border-primary-200"
                                    : "text-gray-600 hover:text-primary-700 hover:bg-primary-50 hover:shadow hover:border-primary-100"
                                }
                            `}
                        >
                            <span
                                className={`text-lg transition-colors duration-400 ${isActive ? "text-primary-500" : "text-gray-400 group-hover:text-primary-500"}`}
                            >
                                {item.icon}
                            </span>
                            <span>{item.label}</span>
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
};

export default Sidebar;
