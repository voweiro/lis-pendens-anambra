import type React from "react"
import { FaHome, FaSearch, FaArrowRight } from "react-icons/fa"

interface DashboardSummaryProps {
  userName: string
  totalProperties: string
  totalSearches: string
  profileCompletion: number // 0 - 100
}

const DashboardSummary: React.FC<DashboardSummaryProps> = ({
  userName,
  totalProperties,
  totalSearches,
  profileCompletion,
}) => {
  return (
    <div className="flex flex-col lg:flex-row gap-6 w-full">
      {/* Welcome Section */}
      <div className="flex-1 bg-[#4E4448] text-white rounded-[30px] p-8 relative">
        <div className="flex flex-col h-full max-w-[80%] relative">
          <h2 className="text-3xl font-normal">
            Hello, <span className="font-bold">{userName}</span>
          </h2>
          <p className="mt-2 w-[65%] text-sm opacity-90 max-w-md">
            The User Dashboard is designed to efficiently manage the biodata of your searches.
          </p>

          <div className="mt-6">
            <button className="px-6 py-3 bg-white text-black rounded-full font-medium hover:bg-gray-100 transition">
              Search property
            </button>
          </div>

          <p className="mt-4 text-sm cursor-pointer">How property search work?</p>

          <div className="absolute top-1/2 right-0 transform -translate-y-1/2 flex flex-col gap-6 mr-8">
            <div className="flex items-center gap-3">
              <div className="bg-[#D7C7C9] text-[#4E4448] p-2 rounded-full">
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
      <div className="w-full lg:w-[350px] bg-[#EAE8E7] text-black rounded-[30px] p-8 flex flex-col">
        <h3 className="text-lg font-medium">Profile</h3>

        <div className="flex justify-between items-center mt-6">
          <div>
            <p className="text-5xl font-bold">{profileCompletion}%</p>
            <p className="text-sm mt-1">Completeness</p>
          </div>

          {/* Circle Progress */}
          <div className="relative w-24 h-24">
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
          <button className="w-full flex justify-between items-center bg-white text-black rounded-full px-5 py-3 font-medium">
            <span>Proceed to complete your profile</span>
            <span className="bg-black text-white p-1.5 rounded-full">
              <FaArrowRight size={12} />
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default DashboardSummary
