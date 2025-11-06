"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { colectorMenuItems } from "@/constants/colector/MenuItems";
import { IoSparklesOutline } from "react-icons/io5";

const Sidebar = () => {
  const pathname = usePathname();

  return (
    <aside className="w-64 h-full bg-white border-r border-gray-100 flex flex-col shadow-lg overflow-y-auto">
      <nav className="flex-1 p-4 space-y-2">
        {colectorMenuItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link
              key={item.label}
              href={item.path}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg text-base font-medium transition-all duration-200 group
                ${
                  isActive
                    ? "bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 shadow-lg border border-purple-200"
                    : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                }
              `}
            >
              <span
                className={`text-lg transition ${
                  isActive ? "text-purple-500" : "text-gray-400 group-hover:text-blue-500"
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