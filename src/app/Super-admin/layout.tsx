// components/layout/NormalUserLayout.tsx

import React, { ReactNode } from 'react';
import UserSidebar from '@/components/super-admin/dashboard/Sidebar';
import Topbar from '@/components/super-admin/dashboard/Header';
import { Sidebar } from '@/components/manage-cases/sidebar';


type NormalUserLayoutProps = {
  title: string; // Page title to pass to the topbar
  children: ReactNode;
  className?: string; // Allow className prop
};

const SuperAdminLayout = ({ title, children, className }: NormalUserLayoutProps) => {
  return (
    <div className={`flex h-screen bg-[#F6F6F6] ${className || ''}`}>
      {/* Sidebar */}
      <aside className="w-[240px] bg-white border-r border-gray-200">
        <Sidebar/>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        

        {/* Page Content */}
        <div className="p-6 overflow-auto h-full">
          {children}
        </div>
      </main>
    </div>
  );
};

export default SuperAdminLayout;
