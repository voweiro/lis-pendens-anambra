"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import usericon from "@/asserts/user-avatar.png"

type HeaderProps = {
  title: string
}

const Header = ({ title }: HeaderProps) => {
  const [isMobile, setIsMobile] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  // Check if we're on mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    // Initial check
    checkIfMobile()

    // Add event listener
    window.addEventListener("resize", checkIfMobile)

    // Cleanup
    return () => window.removeEventListener("resize", checkIfMobile)
  }, [])

  return (
    <div className="  w-full lg:w-[98%] mt-2">
      <div className="left-10 flex justify-between items-center border-[#23A863] shadow-sm rounded-2xl lg:h-[100px] h-full px-4 md:px-6">
        {/* Left side with title - adjusted padding for mobile */}
        <h1 className="lg:text-[38px] text-[25px] font-bold pl-0 md:pl-4  left-7 relative lg:pl-7">{title}</h1>

        {/* Right side with search and avatar */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* Search input - hidden on mobile unless toggled */}
          <div className="relative">
            {isMobile ? (
              <>
                {isSearchOpen ? (
                  <input
                    type="text"
                    placeholder="Search"
                    className="px-4 py-2 rounded-full border absolute right-0 top-0 w-[180px]"
                    autoFocus
                    onBlur={() => setIsSearchOpen(false)}
                  />
                ) : (
                  <button
                    onClick={() => setIsSearchOpen(true)}
                    className="p-2 rounded-full hover:bg-gray-100"
                    aria-label="Search"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </button>
                )}
              </>
            ) : (
              <input type="text" placeholder="Search" className="px-4 py-2 rounded-full border" />
            )}
          </div>

          {/* User avatar */}
          <Image src={usericon || "/placeholder.svg"} alt="User" className="w-8 h-8 md:w-10 md:h-10 rounded-full" />
        </div>
      </div>
      <hr className="w-full lg:w-[98%] border-[#23A863] border-b-[1px]" />
    </div>
  )
}

export default Header
