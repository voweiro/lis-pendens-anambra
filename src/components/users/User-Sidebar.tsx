// Sidebar.tsx
import {
    HomeIcon,
    ClockIcon,
    Cog6ToothIcon,
    ArrowLeftOnRectangleIcon,
  } from '@heroicons/react/24/outline';
  
  const Sidebar = () => {
    return (
      <aside className="flex flex-col justify-between h-screen w-[250px] bg-gradient-to-b from-white to-[#f1f0f4] p-6">
        {/* Top Navigation */}
        <nav className="space-y-6">
          {/* Dashboard - Active */}
          <div className="flex items-center gap-3 px-4 py-2 rounded-full border border-black font-medium text-black">
            <HomeIcon className="w-5 h-5" />
            <span>Dashboard</span>
          </div>
  
          {/* Search History */}
          <div className="flex items-center gap-3 px-4 py-2 text-gray-600 hover:text-black cursor-pointer">
            <ClockIcon className="w-5 h-5" />
            <span>Search History</span>
          </div>
  
          {/* Settings */}
          <div className="flex items-center gap-3 px-4 py-2 text-gray-600 hover:text-black cursor-pointer">
            <Cog6ToothIcon className="w-5 h-5" />
            <span>Settings</span>
          </div>
        </nav>
  
        {/* Logout Button */}
        <div className="mt-auto">
          <button className="flex items-center gap-2 bg-[#4b3b4f] text-white px-5 py-2 rounded-full hover:bg-[#3a2c3d] transition">
            <ArrowLeftOnRectangleIcon className="w-5 h-5" />
            <span>Log out</span>
          </button>
        </div>
      </aside>
    );
  };
  
  export default Sidebar;
  