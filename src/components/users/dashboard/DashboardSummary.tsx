"use client"
import Link from "next/link"
import type React from "react"
import { FaHome, FaSearch, FaArrowRight } from "react-icons/fa"
import { useState } from "react"
import { useForm } from "react-hook-form"
import UsersSearchForm from "@/components/users/User-Search-Form"
import { Gavel, GavelIcon, Home } from "lucide-react"
import { LuGavel } from "react-icons/lu"

interface DashboardSummaryProps {
  userName: string
  totalProperties: string
  totalSearches: string
  profileCompletion: number
}

const DashboardSummary: React.FC<DashboardSummaryProps> = ({
  userName,
  totalProperties,
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
              onClose={() => setShowSearchForm(false)}
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
            <div className="mt-10 lg:mt-0 lg:absolute lg:top-1/2 lg:right-0 lg:transform lg:-translate-y-1/2 flex flex-col sm:flex-row lg:flex-col gap-10 lg:mr-8">
              <div className="flex items-center gap-3">
                <div className="bg-[#ffffff] text-[#23A863] p-2 rounded-full">
                  <Home size={42} />
                </div>
                <div>
                  <p className="text-2xl font-bold">{totalProperties}</p>
                  <p className="text-xs opacity-80">Total Properties</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="bg-[#ffffff] text-[#23A863] p-2 rounded-full">
                  <LuGavel size={50} />
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
        <div className="w-full lg:w-[350px] bg-[#23A863] text-white rounded-[30px] p-6 md:p-8 flex flex-col">
          <h3 className="text-[26px] font-medium">Total Amount Spent</h3>
          <div className="flex justify-between items-center mt-6 flex-wrap gap-4">
            <div>
              <p className="text-[60px] font-bold"> ₦{profileCompletion}</p>
              
            </div>
           
          </div>

          {/* CTA */}
          
        </div>
      </div>
    </>
  )
}

export default DashboardSummary
