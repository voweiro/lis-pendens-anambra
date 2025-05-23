"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  BarChart,
  Briefcase,
  FlagIcon,
  Settings,
  Menu,
  X,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import { RxDashboard } from "react-icons/rx";
import UploadCaseForm from "../upload-case-form";

interface NavItem {
  path: string;
  label: string;
  icon: React.ReactNode;
}

const Sidebar: React.FC = () => {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Close sidebar when route changes on mobile
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    router.push("/pages/signin");
  };

  const navItems: NavItem[] = [
    {
      path: "/court-registrar",
      label: "Dashboard",
      icon: <RxDashboard className="w-5 h-5" />,
    },
    {
      path: "/court-registrar/managecase",
      label: "Manage Cases",
      icon: <Briefcase className="w-5 h-5" />,
    },
    {
      path: "/court-registrar/activity-logs",
      label: "Activity Logs",
      icon: <BarChart className="w-5 h-5" />,
    },
    {
      path: "/court-registrar/setting",
      label: "Settings",
      icon: <Settings className="w-5 h-5" />,
    },
  ];

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <>
      {/* Mobile hamburger */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 bg-white border border-gray-300 rounded-md p-2 shadow-md transition-all hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"
        onClick={() => setOpen(!open)}
        aria-label="Toggle sidebar"
      >
        {open ? (
          <X className="w-6 h-6 text-gray-700" />
        ) : (
          <Menu className="w-6 h-6 text-gray-700" />
        )}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 h-screen bg-white shadow-lg border-r border-gray-200 transition-all duration-300 ease-in-out
        ${
          open
            ? "w-64 translate-x-0"
            : "-translate-x-full md:translate-x-0 w-64"
        }`}
      >
        <div className="flex flex-col h-full py-6 px-4 overflow-y-auto">
          {/* Logo or Brand */}
          <div className="mb-8 flex justify-center">
            <h1 className="text-xl font-bold text-green-600">
              Court Registrar
            </h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1">
            <ul className="space-y-3">
              {navItems.map((item) => (
                <li key={item.path}>
                  <Link href={item.path}>
                    <div
                      className={`w-full flex items-center gap-2 px-4 py-3 rounded-lg transition-all duration-200 ${
                        isActive(item.path)
                          ? "bg-green-600 text-white font-medium"
                          : "text-gray-700 hover:bg-green-100"
                      }`}
                    >
                      <span
                        className={
                          isActive(item.path) ? "text-white" : "text-gray-500"
                        }
                      >
                        {item.icon}
                      </span>
                      <span className="text-sm md:text-base">{item.label}</span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-8">
              <div className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg bg-[#F8F8F8] hover:bg-gray-100 transition-colors duration-200">
                <UploadCaseForm />
              </div>
            </div>
          </nav>

          {/* Logout Button */}
          <div className="mt-auto pt-6">
            <button
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-green-600 hover:bg-green-700 text-white font-medium text-sm md:text-base transition-colors duration-200"
              onClick={handleLogout}
            >
              <LogOut className="w-5 h-5" />
              <span>Log out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden transition-opacity duration-300"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  );
};

export default Sidebar;
