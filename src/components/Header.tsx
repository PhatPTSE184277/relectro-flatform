"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { IoSparklesOutline } from "react-icons/io5";

const Header = () => {
  const pathname = usePathname();

  const handleReloadIfHome = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (pathname === "/") {
      e.preventDefault();
      window.location.reload();
    }
  };

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link
              href="/"
              className="text-2xl font-bold bg-gradient-to-r from-primary-500 to-primary-400 bg-clip-text text-transparent flex items-center gap-2"
              onClick={handleReloadIfHome}
            >
              <IoSparklesOutline className="text-primary-400 text-2xl" />
              Thu gom
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;