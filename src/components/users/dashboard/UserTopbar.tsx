import React from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { FiSearch } from 'react-icons/fi';

const getPageTitle = (pathname: string) => {
  switch (pathname) {
    case '/dashboard':
      return 'Dashboard';
    case '/settings':
      return 'Settings';
    case '/search-history':
      return 'Search History';
    // Add more routes as needed
    default:
      return 'Page';
  }
};

const Topbar = () => {
  const router = useRouter();
  const pageTitle = getPageTitle(router.pathname);

  return (
    <div className="flex justify-between items-center px-6 py-4 bg-white rounded-md shadow-sm">
      <h1 className="text-xl font-semibold">{pageTitle}</h1>

      <div className="flex items-center gap-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search"
            className="pl-4 pr-10 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-300"
          />
          <FiSearch className="absolute right-3 top-2.5 text-gray-500" />
        </div>

        <Image
          src="/user-avatar.jpg" // Replace with actual profile image or dynamic source
          alt="Profile"
          width={36}
          height={36}
          className="rounded-full object-cover"
        />
      </div>
    </div>
  );
};

export default Topbar;
