"use client";
// Sidebar.tsx
import {
    HomeIcon,
    ClockIcon,
    Cog6ToothIcon,
    ArrowLeftOnRectangleIcon,
  } from '@heroicons/react/24/outline';
import Link from 'next/link';
  
  import useAuth from '../../hooks/useAuth';
  const Sidebar = () => {
    const { logout } = useAuth();
    return (
      <aside className="flex flex-col justify-between h-screen w-[250px] bg-gradient-to-tl from-[#23a86362] to-[#eefbff] p-6">
        {/* Top Navigation */}
        <nav className="space-y-6">
          {/* Dashboard - Active */}
          <Link href="/users" className="cursor flex items-center gap-3 px-4 py-2 rounded-full border border-black font-medium text-black">
            <HomeIcon className="w-5 h-5" />
            <span>Dashboard</span>
          </Link>
  
          {/* Search History */}
          <Link href="/users/user-search-history" className="flex items-center gap-3 px-4 py-2 text-gray-600 hover:text-black cursor-pointer">
            <ClockIcon className="w-5 h-5" />
            <span>Search History</span>
          </Link>
  
          {/* Settings */}
          <Link href="/users/user-setting" className="flex items-center gap-3 px-4 py-2 text-gray-600 hover:text-black cursor-pointer">
            <Cog6ToothIcon className="w-5 h-5" />
            <span>Settings</span>
          </Link>
        </nav>
  
        {/* Logout Button */}
        <div className="mt-auto">
          <button onClick={logout} className="flex items-center gap-2 bg-[#4b3b4f] text-white px-5 py-2 rounded-full hover:bg-[#3a2c3d] transition">
            <ArrowLeftOnRectangleIcon className="w-5 h-5" />
            <span>Log out</span>
          </button>
        </div>
      </aside>
    );
  };
  
  export default Sidebar;