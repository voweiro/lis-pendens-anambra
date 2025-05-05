import React from 'react';
import Link from 'next/link';

const Sidebar: React.FC = () => (
  <aside className="bg-white md:bg-transparent md:border-none border-r border-gray-200 flex flex-col py-8 px-2 md:px-6 min-h-screen w-20 md:w-56 transition-all">
    <nav className="flex flex-col gap-2">
      <Link href="/users/dashboard">
        <span className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition font-medium text-gray-700">
          <span className="material-icons md-18">dashboard</span>
          <span className="hidden md:inline">Dashboard</span>
        </span>
      </Link>
      <Link href="/users/user-search-history">
        <span className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 font-semibold text-primary">
          <span className="material-icons md-18">history</span>
          <span className="hidden md:inline">Search History</span>
        </span>
      </Link>
      <Link href="/users/user-setting">
        <span className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition font-medium text-gray-700">
          <span className="material-icons md-18">settings</span>
          <span className="hidden md:inline">Settings</span>
        </span>
      </Link>
    </nav>
    <div className="mt-auto pt-8">
      <button className="w-full flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition text-gray-700 font-medium">
        <span className="material-icons md-18">logout</span>
        <span className="hidden md:inline">Log out</span>
      </button>
    </div>
  </aside>
);

export default Sidebar;
