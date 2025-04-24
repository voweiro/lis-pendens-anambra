// components/layout/NormalUserLayout.tsx

import React, { ReactNode } from 'react';
import UserSidebar from '@/components/users/User-Sidebar';
import Topbar from '@/components/users/dashboard/UserTopbar';

type NormalUserLayoutProps = {
  title: string; // Page title to pass to the topbar
  children: ReactNode;
};

const NormalUserLayout = ({ title, children }: NormalUserLayoutProps) => {
  return (
    <div className="flex h-screen bg-[#F6F6F6]">
      {/* Sidebar */}
      <aside className="w-[240px] bg-white border-r border-gray-200">
        <UserSidebar />
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <Topbar title={title} />

        {/* Page Content */}
        <div className="p-6 overflow-auto h-full">
          {children}
        </div>
      </main>
    </div>
  );
};

export default NormalUserLayout;
