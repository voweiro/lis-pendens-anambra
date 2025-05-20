"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import UsersSearchForm from "@/components/users/User-Search-Form"
import { Home } from "lucide-react"
import { LuGavel } from "react-icons/lu"

interface DashboardSummaryProps {
  userName: string
  totalProperties: string
  totalSearches: string
  profileCompletion: number
}

const DashboardSummary: React.FC<DashboardSummaryProps> = ({
  userName: propUserName,
  totalProperties,
  totalSearches,
  profileCompletion,
}) => {
  const [showSearchForm, setShowSearchForm] = useState(false)
  const {
    register,
    watch,
    formState: { errors },
  } = useForm()
  const [isSearching, setIsSearching] = useState(false)
  const [screenSize, setScreenSize] = useState<"small" | "medium" | "large">("large")
  const [userName, setUserName] = useState(propUserName || 'User')

  // Fetch user name from storage
  useEffect(() => {
    const getUserNameFromStorage = () => {
      try {
        // Try to get user data from auth in session storage first
        const authStr = sessionStorage.getItem('auth');
        if (authStr) {
          const auth = JSON.parse(authStr);
          if (auth.data) {
            // Use name or first_name from auth data
            const name = auth.data.first_name || auth.data.name || auth.data.email;
            if (name) {
              setUserName(name);
              return;
            }
          }
        }
        
        // Try to get user data from user in session storage
        const userStr = sessionStorage.getItem('user');
        if (userStr) {
          const userData = JSON.parse(userStr);
          const name = userData.first_name || userData.name || userData.email;
          if (name) {
            setUserName(name);
            return;
          }
        }
        
        // Try localStorage as a fallback
        const localUserStr = localStorage.getItem('user');
        if (localUserStr) {
          const localUserData = JSON.parse(localUserStr);
          const name = localUserData.first_name || localUserData.name || localUserData.email;
          if (name) {
            setUserName(name);
            return;
          }
        }
        
        // If we still don't have a name, use the prop value or default
        if (!userName || userName === 'User') {
          setUserName(propUserName || 'User');
        }
      } catch (error) {
        console.error('Error getting user name from storage:', error);
        // Fallback to prop value
        setUserName(propUserName || 'User');
      }
    };
    
    getUserNameFromStorage();
  }, [propUserName]);
  
  // Detect screen size for better responsiveness
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth
      if (width < 640) {
        setScreenSize("small")
      } else if (width < 1024) {
        setScreenSize("medium")
      } else {
        setScreenSize("large")
      }
    }

    // Initial check
    handleResize()

    // Add event listener
    window.addEventListener("resize", handleResize)

    // Cleanup
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return (
    <>
      {/* Modal rendered at root level */}
      {showSearchForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-[#00AD20] text-black rounded-2xl shadow-2xl p-6 relative w-full max-w-sm sm:max-w-md">
            <button className="absolute top-2 right-2 text-black text-lg" onClick={() => setShowSearchForm(false)}>
              &times;
            </button>
            <UsersSearchForm
              register={register}
              errors={errors}
              watch={watch}
              isSearching={isSearching}
              onClose={() => setShowSearchForm(false)}
            />
          </div>
        </div>
      )}

      {/* Dashboard Content */}
      <div
        className={`flex flex-col sm:flex-row gap-4 w-full ${showSearchForm ? "blur-sm pointer-events-none select-none" : ""}`}
      >
        {/* Welcome Section - Left card */}
        <div className="flex-1 bg-[#00AD20] text-white rounded-[30px] p-5 sm:p-6 lg:p-8 relative overflow-hidden">
          {/* Content layout based on screen size */}
          <div className="flex flex-col h-full">
            <div className={`${screenSize !== "small" ? "max-w-[60%]" : ""}`}>
              <h2 className="text-2xl sm:text-3xl font-normal">
                Hello, <span className="font-bold">{userName}</span>
              </h2>
              <p className="mt-2 text-sm">
                The User Dashboard is designed to efficiently manage the biodata of your searches.
              </p>

              <div className="mt-4 sm:mt-6">
                <button
                  onClick={() => setShowSearchForm(true)}
                  className="px-4 py-2 sm:px-6 sm:py-3 bg-white text-black rounded-full font-medium hover:bg-gray-100 transition"
                >
                  Search property
                </button>
                <p className="mt-2 sm:mt-3 text-sm cursor-pointer hover:underline">How property search work?</p>
              </div>
            </div>

            {/* Stats - Positioned differently based on screen size */}
            {screenSize === "small" ? (
              // Mobile layout - stacked
              <div className="mt-6 flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className="bg-white text-[#00AD20] p-2 rounded-full">
                    <Home size={32} />
                  </div>
                  <div>
                    <p className="text-xl font-bold">{totalProperties}</p>
                    <p className="text-xs">Total Properties</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="bg-white text-[#00AD20] p-2 rounded-full">
                    <LuGavel size={36} />
                  </div>
                  <div>
                    <p className="text-xl font-bold">{totalSearches}</p>
                    <p className="text-xs">Total Searches</p>
                  </div>
                </div>
              </div>
            ) : (
              // Tablet and Desktop layout - positioned to the right
              <div
                className={`${
                  screenSize === "medium"
                    ? "absolute bottom-6 right-6 flex flex-row gap-6"
                    : "absolute top-1/2 right-8 -translate-y-1/2 flex flex-col gap-8"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="bg-white text-[#00AD20] p-2 rounded-full">
                    <Home size={screenSize === "medium" ? 32 : 42} />
                  </div>
                  <div>
                    <p className="text-xl sm:text-2xl font-bold">{totalProperties}</p>
                    <p className="text-xs">Total Properties</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="bg-white text-[#00AD20] p-2 rounded-full">
                    <LuGavel size={screenSize === "medium" ? 36 : 46} />
                  </div>
                  <div>
                    <p className="text-xl sm:text-2xl font-bold">{totalSearches}</p>
                    <p className="text-xs">Total Searches</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Amount Spent Section - Right card */}
        <div className="w-full sm:w-[300px] md:w-[320px] lg:w-[350px] bg-[#23A863] text-white rounded-[30px] p-5 sm:p-6 lg:p-8 flex flex-col">
          <h3 className="text-xl sm:text-2xl lg:text-[26px] font-medium">Total Amount Spent</h3>

          <div className="flex items-center justify-center flex-grow py-4 sm:py-6">
            <p className="text-4xl sm:text-5xl lg:text-[60px] font-bold">₦{profileCompletion}</p>
          </div>
        </div>
      </div>
    </>
  )
}

export default DashboardSummary
