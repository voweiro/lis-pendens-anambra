"use client"

import { useState } from 'react'
import {
  HomeIcon,
  ClockIcon,
  Cog6ToothIcon,
  ArrowLeftOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import Link from 'next/link'
import useAuth from '../../hooks/useAuth'

const Sidebar = () => {
  const { logout } = useAuth()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        className="md:hidden fixed top-2 left-2  z-70 bg-white border border-gray-300 rounded p-2 shadow"
        onClick={() => setIsOpen(true)}
      >
        <Bars3Icon className="w-6 h-6 text-black" />
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed md:static top-0 left-0 h-full w-[250px] z-40 transform bg-white p-6 transition-transform duration-300 ease-in-out 
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}
      >
        {/* Close button on mobile */}
        <div className="flex justify-end md:hidden mb-4">
          <button onClick={() => setIsOpen(false)} aria-label="Close sidebar">
            <XMarkIcon className="w-6 h-6 text-black" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="space-y-10">
          <Link
            href="/users"
            className="flex items-center gap-3 px-4 py-2 rounded-full border border-black font-medium text-black"
          >
            <HomeIcon className="w-5 h-5 hover:bg-[#23A863] hover:text-white" />
            <span>Dashboard</span>
          </Link>

          <Link
            href="/users/user-search-history"
            className="flex items-center gap-3 px-4 py-2 text-gray-600 hover:text-black"
          >
            <ClockIcon className="w-5 h-5   hover:bg-[#23A863] hover:text-white" />
            <span>Search History</span>
          </Link>

          <Link
            href="/users/user-setting"
            className="flex items-center gap-3 px-4 py-2 text-gray-600   hover:bg-[#23A863] hover:text-white"
          >
            <Cog6ToothIcon className="w-5 h-5   hover:bg-[#23A863] hover:text-white" />
            <span>Settings</span>
          </Link>
        </nav>

        {/* Logout */}
        <div className="mt-auto pt-8">
          <button
            onClick={logout}
            className="flex items-center gap-2 bg-[#8bddb3] text-black px-5 py-2 rounded-full hover:bg-[#0d2519] transition"
          >
            <ArrowLeftOnRectangleIcon className="w-5 h-5" />
            <span>Log out</span>
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}

export default Sidebar
