"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { BarChart, Briefcase, FlagIcon, Settings } from "lucide-react";
import Link from "next/link";
import { RxDashboard } from "react-icons/rx";
import UploadCaseForm from "../upload-case-form";

const Sidebar: React.FC = () => {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    router.push("/pages/signin");
  };

  return (
    <>
      {/* Mobile hamburger */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 bg-white border border-gray-300 rounded p-2 shadow"
        onClick={() => setOpen(!open)}
        aria-label="Toggle sidebar"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 w-64 h-full bg-white shadow-lg border-r border-gray-200 transform transition-transform duration-300 ease-in-out
        ${
          open ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:static md:flex`}
      >
        <div className="flex flex-col h-full py-6 px-4">
          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto">
            <ul className="space-y-12">
              <li>
                <Link href="/court-registrar">
                  <button className="w-full flex items-center gap-2 px-4 py-2 rounded-lg border border-black font-semibold bg-white text-sm md:text-base">
                    <RxDashboard className="w-5 h-5" />
                    Dashboard
                  </button>
                </Link>
              </li>
              <li>
                {" "}
                <Link href="/court-registrar/managecase">
                  <button className="w-full flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-[#9ed8ba] text-sm md:text-base">
                    <Briefcase className="w-5 h-5" />
                    Manage Cases
                  </button>
                </Link>
              </li>
              <li>
                {" "}
                <Link href="/court-registrar/activity-logs">
                  <button className="w-full flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-[#9ed8ba] text-sm md:text-base">
                    <BarChart className="w-5 h-5" />
                    Activity Logs
                  </button>
                </Link>
              </li>
              <li>
                {" "}
                <Link href="/court-registrar/flagged-case">
                  <button className="w-full flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-[#9ed8ba] text-sm md:text-base">
                    <FlagIcon className="w-5 h-5" />
                    Flagged cases
                  </button>
                </Link>
              </li>
              <li>
                {" "}
                <Link href="/court-registrar/setting">
                  <button className="w-full flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-[#9ed8ba] text-sm md:text-base">
                    <Settings className="w-5 h-5" />
                    Settings
                  </button>
                </Link>
              </li>
            </ul>

            <div className="mt-8">
              <div className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-black rounded-lg bg-[#F8F8F8] hover:bg-[#61a783] font-semibold text-sm md:text-base">
                <UploadCaseForm />
              </div>
            </div>
          </nav>

          {/* Upload Button */}

          {/* Logout Button */}
          <div className="mt-auto pt-8">
            <button
              className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-[#23A863] hover:bg-[#9ed8ba] text-white font-semibold text-sm md:text-base"
              onClick={handleLogout}
            >
              <span className="mr-2">&#x1F511;</span>Log out
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-30 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;
