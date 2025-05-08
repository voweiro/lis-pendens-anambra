"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const Sidebar: React.FC = () => {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleLogout = () => {
    // Clear authentication tokens or user info
    localStorage.clear();
    sessionStorage.clear();
    router.push('/pages/signin');
  };

  return (
    <>
      {/* Mobile hamburger */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 bg-white border border-gray-300 rounded p-2 shadow"
        onClick={() => setOpen(!open)}
        aria-label="Toggle sidebar"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      <aside
        className={`flex flex-col h-full bg-transparent py-6 px-4 border-r border-gray-200 w-56 min-w-[200px] fixed md:static top-0 left-0 z-40 transition-transform duration-300
        ${open ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:w-56 md:min-w-[200px] md:h-auto md:relative md:flex md:bg-transparent bg-white shadow-lg`}
        style={{ height: '100vh' }}
      >
        <nav className="flex-1">
          <ul className="space-y-2">
            <li><button className="w-full flex items-center gap-2 px-4 py-2 rounded-lg border border-black font-semibold bg-white text-sm md:text-base">Dashboard</button></li>
            <li><button className="w-full flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 text-sm md:text-base">Manage Cases </button></li>
            <li><button className="w-full flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 text-sm md:text-base">Users</button></li>
            <li><button className="w-full flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 text-sm md:text-base">Activity Logs</button></li>
            <li><button className="w-full flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 text-sm md:text-base">Flagged Cases</button></li>
            <li><button className="w-full flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 text-sm md:text-base">Data Report</button></li>
            <li><button className="w-full flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 text-sm md:text-base">Settings</button></li>
          </ul>
        </nav>
        <div className="mt-8">
          <button className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-black rounded-lg bg-white font-semibold text-sm md:text-base">Upload Record</button>
        </div>
        <div className="mt-auto pt-8">
          <button
            className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-[#4E4448] text-white font-semibold text-sm md:text-base"
            onClick={handleLogout}
          >
            <span className="mr-2">&#x1F511;</span>Log out
          </button>
        </div>
      </aside>
      {/* Overlay for mobile */}
      {open && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-30 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;
