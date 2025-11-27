"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { shipperMenuItems } from "@/constants/shipper/MenuItems";

const Sidebar = () => {
  const pathname = usePathname();

  return (
    <aside className="w-64 h-full bg-white border-r border-gray-100 flex flex-col shadow-lg overflow-y-auto">
      <nav className="flex-1 p-4 space-y-2">
        {shipperMenuItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link
              key={item.label}
              href={item.path}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg text-base font-medium transition-all duration-200 group
                ${
                  isActive
                    ? "bg-blue-50 text-blue-700 shadow border border-blue-200"
                    : "text-gray-600 hover:text-blue-700 hover:bg-blue-50"
                }
              `}
            >
              <span
                className={`text-lg transition ${
                  isActive ? "text-blue-500" : "text-gray-400 group-hover:text-blue-500"
                }`}
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
