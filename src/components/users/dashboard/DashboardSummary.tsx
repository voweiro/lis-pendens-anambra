"use client"
import Link from "next/link"
import type React from "react"
import { FaHome, FaSearch, FaArrowRight } from "react-icons/fa"
import { useState } from "react"
import { useForm } from "react-hook-form"
import UsersSearchForm from "@/components/users/User-Search-Form"

interface DashboardSummaryProps {
  userName: string
  totalProperties: string
  totalLispendees: string
  totalSearches: string
  profileCompletion: number
}

const DashboardSummary: React.FC<DashboardSummaryProps> = ({
  userName,
  totalProperties,
  totalLispendees,
  totalSearches,
  profileCompletion,
}) => {
  const [showSearchForm, setShowSearchForm] = useState(false)
  const { register, watch, formState: { errors } } = useForm();
  const [isSearching, setIsSearching] = useState(false);

  return (
    <>
      {/* Modal rendered at root level */}
      {showSearchForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-[#23A863] text-black rounded-2xl shadow-2xl p-6 relative w-full max-w-sm sm:max-w-md">
            <button
              className="absolute top-2 right-2 text-black text-lg"
              onClick={() => setShowSearchForm(false)}
            >
              &times;
            </button>
            <UsersSearchForm
              register={register}
              errors={errors}
              watch={watch}
              isSearching={isSearching}
            />
          </div>
        </div>
      )}

      {/* Dashboard Content */}
      <div className={`flex flex-col lg:flex-row gap-6 w-full ${showSearchForm ? "blur-sm pointer-events-none select-none" : ""}`}>
        {/* Welcome Section */}
        <div className="flex-1 bg-[#23A863] text-white rounded-[30px] p-6 md:p-8 relative">
          <div className="flex flex-col h-full w-full sm:max-w-[90%] relative">
            <h2 className="text-2xl md:text-3xl font-normal">
              Hello, <span className="font-bold">{userName}</span>
            </h2>
            <p className="mt-2 text-sm opacity-90 max-w-md">
              The User Dashboard is designed to efficiently manage the biodata of your searches.
            </p>
            <div className="mt-6">
              <button onClick={() => setShowSearchForm(true)} className="px-6 py-3 bg-white text-black rounded-full font-medium hover:bg-gray-100 transition">
                Search property
              </button>
            </div>
            <p className="mt-4 text-sm cursor-pointer">How property search work?</p>

            {/* Stats on right for large screens, bottom for small */}
            <div className="mt-10 lg:mt-0 lg:absolute lg:top-1/2 lg:right-0 lg:transform lg:-translate-y-1/2 flex flex-col sm:flex-row lg:flex-col gap-6 lg:mr-8">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-[#0C712E] to-[#eef2ff] text-[#4E4448] p-2 rounded-full">
                  <FaHome size={18} />
                </div>
                <div>
                  <p className="text-2xl font-bold">{totalProperties}</p>
                  <p className="text-xs opacity-80">Total Properties</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="bg-[#D7C7C9] text-[#4E4448] p-2 rounded-full">
                  <FaSearch size={18} />
                </div>
                <div>
                  <p className="text-2xl font-bold">{totalSearches}</p>
                  <p className="text-xs opacity-80">Total Searches</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Section */}
        <div className="w-full lg:w-[350px] bg-[#6ad89ffd] text-black rounded-[30px] p-6 md:p-8 flex flex-col">
          <h3 className="text-lg font-medium">Profile</h3>
          <div className="flex justify-between items-center mt-6 flex-wrap gap-4">
            <div>
              <p className="text-4xl md:text-5xl font-bold">{profileCompletion}%</p>
              <p className="text-sm mt-1">Completeness</p>
            </div>
            <div className="relative w-20 h-20 md:w-24 md:h-24">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="#000000"
                  strokeWidth="8"
                  strokeDasharray="283"
                  strokeDashoffset={283 - (283 * profileCompletion) / 100}
                  strokeLinecap="round"
                  transform="rotate(-90 50 50)"
                />
              </svg>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-auto pt-6">
            <button className="w-full flex justify-between items-center bg-gradient-to-tl from-[#23A863] to-[#eef2ff] text-black rounded-full px-5 py-3 font-medium">
              <span className="text-sm md:text-base">Proceed to complete your profile</span>
              <span className="bg-black text-white p-1.5 rounded-full">
                <FaArrowRight size={12} />
              </span>
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default DashboardSummary
