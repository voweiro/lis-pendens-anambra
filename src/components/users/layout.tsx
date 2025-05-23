// ISSUE 1: In your layout, you're starting with isSidebarOpen = false
// ISSUE 2: The handleMenuClick only sets it to true, but on mobile the sidebar auto-closes
// ISSUE 3: Missing proper state toggle

// FIXED NormalUserLayout.tsx
"use client";
import React, { ReactNode, useState } from "react";
import UserSidebar from "@/components/users/User-Sidebar";
import Topbar from "@/components/users/dashboard/UserTopbar";

type NormalUserLayoutProps = {
  title: string;
  children: ReactNode;
  className?: string;
};

const NormalUserLayout = ({
  title,
  children,
  className,
}: NormalUserLayoutProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // FIXED: Toggle function instead of just setting to true
  const handleMenuClick = () => {
    console.log("Menu clicked, current state:", isSidebarOpen); // Debug log
    setIsSidebarOpen(!isSidebarOpen); // Toggle instead of just setting to true
  };

  const handleSidebarClose = () => {
    console.log("Sidebar closing"); // Debug log
    setIsSidebarOpen(false);
  };

  return (
    <div className={`flex h-screen bg-[#F6F6F6] ${className || ""}`}>
      {/* Sidebar */}
      <UserSidebar isOpen={isSidebarOpen} onClose={handleSidebarClose} />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <div className="-mt-2 ml-1">
          <Topbar title={title} onMenuClick={handleMenuClick} />
        </div>

        {/* Page Content */}
        <div className="p-6 overflow-auto h-full">{children}</div>
      </main>
    </div>
  );
};
export default NormalUserLayout;
