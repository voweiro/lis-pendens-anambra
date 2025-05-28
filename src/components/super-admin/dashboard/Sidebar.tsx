"use client";

import type React from "react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  BarChart2,
  Briefcase,
  Flag,
  LogOut,
  PieChart,
  Settings,
  Upload,
  Users,
  Menu,
  X,
} from "lucide-react";

export function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if screen is mobile size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
      // Auto-close sidebar on mobile when screen size changes
      if (window.innerWidth >= 768) {
        setIsOpen(false);
      }
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isMobile && isOpen) {
        const sidebar = document.getElementById("sidebar");
        const toggleButton = document.getElementById("sidebar-toggle");

        if (
          sidebar &&
          toggleButton &&
          !sidebar.contains(event.target as Node) &&
          !toggleButton.contains(event.target as Node)
        ) {
          setIsOpen(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobile, isOpen]);

  const handleLogout = () => {
    // Clear authentication tokens or user info
    localStorage.clear();
    sessionStorage.clear();
    router.push("/pages/signin");
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const closeSidebar = () => {
    if (isMobile) {
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        id="sidebar-toggle"
        onClick={toggleSidebar}
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-white border border-gray-200 shadow-sm hover:bg-gray-50 transition-colors"
        aria-label="Toggle sidebar"
      >
        {isOpen ? (
          <X className="h-5 w-5 text-gray-700" />
        ) : (
          <Menu className="h-5 w-5 text-gray-700" />
        )}
      </button>

      {/* Overlay for mobile */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        id="sidebar"
        className={`
          fixed md:static inset-y-0 left-0 z-40
          w-[280px] sm:w-[300px] md:w-[220px] lg:w-[260px]
          bg-white border-r border-gray-200 p-4 flex flex-col h-full
          transform transition-transform duration-300 ease-in-out
          ${
            isMobile
              ? isOpen
                ? "translate-x-0"
                : "-translate-x-full"
              : "translate-x-0"
          }
          ${isMobile ? "shadow-xl" : ""}
        `}
      >
        {/* Header */}
        <div className="mb-6 pt-2">
          <div className="flex justify-center">
            <h1 className="text-[26px] font-bold text-[]ffbb10]">
              Lis Pendens Anambra
            </h1>
          </div>
        </div>
        <hr className="w-full border-t border-[#ffbb10]" />

        <nav className="space-y-1 sm:space-y-2 flex-1">
          <SidebarItem
            icon={<BarChart2 className="h-5 w-5" />}
            label="Dashboard"
            href="/Super-admin"
            isActive={pathname === "/Super-admin"}
            onClick={closeSidebar}
          />
          <SidebarItem
            icon={<Briefcase className="h-5 w-5" />}
            label="Manage Cases"
            href="/Super-admin/manage-cases"
            isActive={pathname === "/Super-admin/manage-cases"}
            onClick={closeSidebar}
          />
          <SidebarItem
            icon={<Users className="h-5 w-5" />}
            label="Users"
            href="/Super-admin/users-management"
            isActive={pathname === "/Super-admin/users-management"}
            onClick={closeSidebar}
          />
          <SidebarItem
            icon={<BarChart2 className="h-5 w-5 rotate-90" />}
            label="Activity Logs"
            href="/Super-admin/activity-logs"
            isActive={pathname === "/Super-admin/activity-logs"}
            onClick={closeSidebar}
          />
          <SidebarItem
            icon={<PieChart className="h-5 w-5" />}
            label="Data Reports"
            href="/Super-admin/data-report"
            isActive={pathname === "/Super-admin/data-report"}
            onClick={closeSidebar}
          />
          <SidebarItem
            icon={<Settings className="h-5 w-5" />}
            label="Settings"
            href="/Super-admin/settings"
            isActive={pathname === "/Super-admin/settings"}
            onClick={closeSidebar}
          />
        </nav>

        <div className="mt-auto space-y-3 sm:space-y-4">
          <button
            className="w-full flex items-center justify-center gap-2 border border-gray-300 rounded-md py-2.5 sm:py-2 px-4 text-gray-700 hover:bg-gray-50 transition-colors text-sm sm:text-base"
            onClick={closeSidebar}
          >
            <Upload className="h-4 w-4 sm:h-5 sm:w-5" />
            <span>Upload Record</span>
          </button>

          <button
            onClick={() => {
              handleLogout();
              closeSidebar();
            }}
            className="w-full flex items-center justify-center gap-2 bg-yellow-300 text-white rounded-md py-2.5 sm:py-2 px-4 hover:bg-gray-800 transition-colors text-sm sm:text-base"
          >
            <LogOut className="h-4 w-4 sm:h-5 sm:w-5" />
            <span>Log out</span>
          </button>
        </div>
      </aside>
    </>
  );
}

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  isActive?: boolean;
  onClick?: () => void;
}

function SidebarItem({
  icon,
  label,
  href,
  isActive,
  onClick,
}: SidebarItemProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`flex items-center gap-3 px-3 py-2.5 sm:py-2 rounded-md text-sm sm:text-base transition-colors ${
        isActive
          ? "bg-green-500 text-white font-medium shadow-sm"
          : "text-gray-700 hover:bg-gray-100"
      }`}
    >
      <span className="flex-shrink-0">{icon}</span>
      <span className="truncate">{label}</span>
    </Link>
  );
}
