"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import useAuth from "../../hooks/useAuth"
import { cn } from "@/lib/utils"
import {
  HomeIcon,
  ClockIcon,
  Cog6ToothIcon,
  ArrowLeftOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline"

const Sidebar = () => {
  const { logout } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const [isMobile, setIsMobile] = useState(false)

  // Check if we're on mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    // Initial check
    checkIfMobile()

    // Add event listener
    window.addEventListener("resize", checkIfMobile)

    // Close sidebar when clicking outside on mobile
    const handleOutsideClick = (event: MouseEvent) => {
      if (isOpen && window.innerWidth < 768) {
        const sidebar = document.getElementById("sidebar")
        if (sidebar && !sidebar.contains(event.target as Node)) {
          setIsOpen(false)
        }
      }
    }

    document.addEventListener("mousedown", handleOutsideClick)

    // Cleanup
    return () => {
      window.removeEventListener("resize", checkIfMobile)
      document.removeEventListener("mousedown", handleOutsideClick)
    }
  }, [isOpen])

  // Close sidebar when route changes on mobile
  useEffect(() => {
    if (window.innerWidth < 768) {
      setIsOpen(false)
    }
  }, [pathname])

  // Navigation items
  const navItems = [
    { href: "/users", label: "Dashboard", icon: HomeIcon },
    { href: "/users/user-search-history", label: "Search History", icon: ClockIcon },
    { href: "/users/user-setting", label: "Settings", icon: Cog6ToothIcon },
  ]

  return (
    <>
      {/* Mobile Toggle Button - only show when sidebar is closed */}
      {!isOpen && (
        <button
          className="md:hidden fixed top-2 -left-2 z-50 bg-white border border-gray-300 rounded-md p-2 shadow-md"
          onClick={() => setIsOpen(true)}
          aria-label="Open sidebar"
        >
          <Bars3Icon className="w-5 h-5 text-black" />
        </button>
      )}

      {/* Sidebar */}
      <aside
        id="sidebar"
        className={cn(
          "fixed md:sticky top-0 left-0 h-screen w-64 z-40 bg-white shadow-lg border-r border-gray-200",
          "transition-transform duration-300 ease-in-out",
          "flex flex-col",
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
        )}
      >
        {/* Header with Close Button */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h1 className="text-xl text-[#00AD20] font-bold">Lis Pendens Enugu</h1> 
          {isOpen && (
            <button
              onClick={() => setIsOpen(false)}
              className="md:hidden p-1 rounded-md hover:bg-gray-100"
              aria-label="Close sidebar"
            >
              <XMarkIcon className="w-5 h-5 text-black" />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4">
          <ul className="space-y-2">
            {navItems.map((item) => {
              const isActive =
                item.href === "/users"
                  ? pathname === "/users" ||
                    (pathname?.startsWith("/users/") &&
                      !navItems.some((ni) => ni.href !== "/users" && pathname?.startsWith(ni.href)))
                  : pathname?.startsWith(item.href)
              const Icon = item.icon

              return (
                <li key={item.href}>
                  <Link href={item.href}>
                    <div
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-colors",
                        isActive
                          ? "bg-[#23A863]/10 text-[#00AD20] font-semibold border border-[#00AD20]"
                          : "text-gray-700 hover:bg-[#00AD20]",
                      )}
                    >
                      <Icon className={cn("w-5 h-5", isActive ? "text-[#00AD20]" : "")} />
                      <span>{item.label}</span>
                    </div>
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Footer with Logout Button */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 bg-[#8bddb3] text-black px-5 py-3 rounded-lg hover:bg-[#00AD20] hover:text-white transition-colors"
          >
            <ArrowLeftOnRectangleIcon className="w-5 h-5" />
            <span>Log out</span>
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  )
}

export default Sidebar
