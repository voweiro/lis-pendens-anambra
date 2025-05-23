// components/layout/NormalUserLayout.tsx

import React, { ReactNode } from "react";
import { Sidebar } from "@/components/super-admin/dashboard/Sidebar";
import Topbar from "@/components/super-admin/dashboard/Header";

type NormalUserLayoutProps = {
  title: string; // Page title to pass to the topbar
  description: string; // Page description to pass to the topbar
  children: ReactNode;
  className?: string; // Allow className prop
};

const CourtRegistrarLayout = ({
  title,
  description,
  children,
  className,
}: NormalUserLayoutProps) => {
  return (
    <div className={`flex h-screen bg-[#F6F6F6] ${className || ""}`}>
      {/* Sidebar */}

      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <div className="mt-4 ml-4">
          <Topbar title={title} description={description} />
        </div>

        {/* Page Content */}
        <div className="p-6 overflow-auto h-full">{children}</div>
      </main>
    </div>
  );
};

export default CourtRegistrarLayout;
