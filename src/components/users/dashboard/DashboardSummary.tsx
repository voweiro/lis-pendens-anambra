"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import UsersSearchForm from "@/components/users/User-Search-Form";
import { Home } from "lucide-react";
import { LuGavel } from "react-icons/lu";
import { GetUserDashboardSummary } from "@/Services/AuthRequest/auth.request";
import { toast } from "react-toastify";

interface DashboardSummaryProps {
  userName?: string;
  totalProperties?: string;
  totalSearches?: string;
  profileCompletion?: number;
}

const DashboardSummary: React.FC<DashboardSummaryProps> = ({
  userName: propUserName,
  totalProperties,
  totalSearches,
  profileCompletion,
}) => {
  const [showSearchForm, setShowSearchForm] = useState(false);
  const {
    register,
    watch,
    formState: { errors },
  } = useForm();
  const [isSearching, setIsSearching] = useState(false);
  const [userName, setUserName] = useState(propUserName || "User");
  const [dashboardData, setDashboardData] = useState({
    totalProperties: totalProperties || "0",
    totalSearches: totalSearches || "0",
    profileCompletion: profileCompletion || 0,
    isLoading: true,
    error: "",
  });

  // Fetch user name from storage and dashboard data from API
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setDashboardData((prev) => ({ ...prev, isLoading: true, error: "" }));

        // Call the GetUserDashboardSummary API function
        const response = await GetUserDashboardSummary();
        console.log("Dashboard summary response:", response);

        if (response.success && response.data) {
          const data = response.data;

          // Extract the total properties and total searches from the response
          // Handle the specific API response format: {total_search_property, total_case}
          const totalProps =
            data.total_search_property ||
            data.total_properties ||
            data.totalProperties ||
            data.properties_count ||
            "0";
          const totalSearchCount =
            data.total_case ||
            data.total_searches ||
            data.totalSearches ||
            data.searches_count ||
            "0";

          setDashboardData({
            totalProperties: String(totalProps),
            totalSearches: String(totalSearchCount),
            profileCompletion: profileCompletion || 0,
            isLoading: false,
            error: "",
          });

          console.log("Dashboard data updated:", {
            totalProperties: totalProps,
            totalSearches: totalSearchCount,
          });
        } else {
          // If the API call was not successful, use the prop values
          setDashboardData({
            totalProperties: totalProperties || "0",
            totalSearches: totalSearches || "0",
            profileCompletion: profileCompletion || 0,
            isLoading: false,
            error: response.error || "Failed to fetch dashboard data",
          });

          if (response.error) {
            console.error("Error fetching dashboard data:", response.error);
          }
        }
      } catch (error) {
        console.error("Error in fetchDashboardData:", error);
        setDashboardData((prev) => ({
          ...prev,
          isLoading: false,
          error: error instanceof Error ? error.message : "Unknown error",
        }));
      }
    };

    const getUserNameFromStorage = () => {
      try {
        // Try to get user data from auth in session storage first
        const authStr = sessionStorage.getItem("auth");
        if (authStr) {
          const auth = JSON.parse(authStr);
          if (auth.data) {
            // Use name or first_name from auth data
            const name =
              auth.data.first_name || auth.data.name || auth.data.email;
            if (name) {
              setUserName(name);
              return;
            }
          }
        }

        // Try to get user data from user in session storage
        const userStr = sessionStorage.getItem("user");
        if (userStr) {
          const userData = JSON.parse(userStr);
          const name = userData.first_name || userData.name || userData.email;
          if (name) {
            setUserName(name);
            return;
          }
        }

        // Try localStorage as a fallback
        const localUserStr = localStorage.getItem("user");
        if (localUserStr) {
          const localUserData = JSON.parse(localUserStr);
          const name =
            localUserData.first_name ||
            localUserData.name ||
            localUserData.email;
          if (name) {
            setUserName(name);
            return;
          }
        }

        // If we still don't have a name, use the prop value or default
        if (!userName || userName === "User") {
          setUserName(propUserName || "User");
        }
      } catch (error) {
        console.error("Error getting user name from storage:", error);
        // Fallback to prop value
        setUserName(propUserName || "User");
      }
    };

    getUserNameFromStorage();
    fetchDashboardData();
  }, [totalProperties, totalSearches, profileCompletion]);

  return (
    <>
      {/* Modal rendered at root level */}
      {showSearchForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="text-black rounded-2xl shadow-2xl p-6 relative w-full max-w-sm sm:max-w-md">
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
      <div
        className={`w-full ${
          showSearchForm ? "blur-sm pointer-events-none select-none" : ""
        }`}
      >
        {/* Mobile Layout (< 768px) */}
        <div className="block md:hidden space-y-4">
          {/* Welcome Section */}
          <div className="bg-[#FFBB10] text-white rounded-[30px] p-6 relative overflow-hidden">
            <div className="mb-6">
              <h2 className="text-2xl font-normal">
                Hello, <span className="font-bold">{userName}</span>
              </h2>
              <p className="mt-2 text-sm opacity-90">
                The User Dashboard is designed to efficiently manage the biodata
                of your searches.
              </p>

              <div className="mt-4">
                <button
                  onClick={() => setShowSearchForm(true)}
                  className="px-4 py-2 bg-white text-black rounded-full font-medium hover:bg-gray-100 transition"
                >
                  Search property
                </button>
                <p className="mt-2 text-sm cursor-pointer hover:underline opacity-90">
                  How property search work?
                </p>
              </div>
            </div>

            {/* Stats Row */}
            <div className="flex justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="bg-white text-[#FFFBB10] p-2 rounded-full flex-shrink-0">
                  <Home size={24} />
                </div>
                <div>
                  <p className="text-lg font-bold">
                    {dashboardData.isLoading
                      ? "Loading..."
                      : dashboardData.totalProperties}
                  </p>
                  <p className="text-xs opacity-90">Total Properties</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="bg-white text-[#FFBB10] p-2 rounded-full flex-shrink-0">
                  <LuGavel size={24} />
                </div>
                <div>
                  <p className="text-lg font-bold">
                    {dashboardData.isLoading
                      ? "Loading..."
                      : dashboardData.totalSearches}
                  </p>
                  <p className="text-xs opacity-90">Total Searches</p>
                </div>
              </div>
            </div>
          </div>

          {/* Amount Spent Section */}
          <div className="bg-[#FFBB10] text-white rounded-[30px] p-6 text-center">
            <h3 className="text-lg font-medium mb-4">Total Amount Spent</h3>
            <p className="text-3xl font-bold">₦{profileCompletion}</p>
          </div>
        </div>

        {/* Tablet Layout (768px - 1024px) */}
        <div className="hidden md:block lg:hidden space-y-4">
          {/* Welcome Section - Full width */}
          <div className="bg-[#FFBB10] text-white rounded-[30px] p-6 relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
              {/* Left content */}
              <div className="flex-1 max-w-md">
                <h2 className="text-2xl font-normal">
                  Hello, <span className="font-bold">{userName}</span>
                </h2>
                <p className="mt-2 text-sm opacity-90 leading-relaxed">
                  The User Dashboard is designed to efficiently manage the
                  biodata of your searches.
                </p>

                <div className="mt-4">
                  <button
                    onClick={() => setShowSearchForm(true)}
                    className="px-5 py-2.5 bg-white text-black rounded-full font-medium hover:bg-gray-100 transition"
                  >
                    Search property
                  </button>
                  <p className="mt-2 text-sm cursor-pointer hover:underline opacity-90">
                    How property search work?
                  </p>
                </div>
              </div>

              {/* Right stats */}
              <div className="flex flex-col gap-4 mt-6 sm:mt-0 sm:ml-6">
                <div className="flex items-center gap-3">
                  <div className="bg-white text-[#FFBB10] p-2 rounded-full flex-shrink-0">
                    <Home size={24} />
                  </div>
                  <div>
                    <p className="text-xl font-bold">
                      {dashboardData.isLoading
                        ? "Loading..."
                        : dashboardData.totalProperties}
                    </p>
                    <p className="text-xs opacity-90">Total Properties</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="bg-white text-[#FFBB10] p-2 rounded-full flex-shrink-0">
                    <LuGavel size={24} />
                  </div>
                  <div>
                    <p className="text-xl font-bold">
                      {dashboardData.isLoading
                        ? "Loading..."
                        : dashboardData.totalSearches}
                    </p>
                    <p className="text-xs opacity-90">Total Searches</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Amount Spent Section - Full width */}
          <div className="bg-[#FFBB10] text-white rounded-[30px] p-6 text-center">
            <h3 className="text-xl font-medium mb-4">Total Amount Spent</h3>
            <p className="text-4xl font-bold">₦{profileCompletion}</p>
          </div>
        </div>

        {/* Desktop Layout (>= 1024px) */}
        <div className="hidden lg:flex gap-6">
          {/* Welcome Section */}
          <div className="flex-1 bg-[#FFBB10] text-white rounded-[30px] p-8 relative overflow-hidden min-h-[280px]">
            <div className="max-w-[65%]">
              <h2 className="text-3xl font-normal">
                Hello, <span className="font-bold">{userName}</span>
              </h2>
              <p className="mt-3 text-sm opacity-90 leading-relaxed">
                The User Dashboard is designed to efficiently manage the biodata
                of your searches.
              </p>

              <div className="mt-6">
                <button
                  onClick={() => setShowSearchForm(true)}
                  className="px-6 py-3 bg-white text-black rounded-full font-medium hover:bg-gray-100 transition"
                >
                  Search property
                </button>
                <p className="mt-3 text-sm cursor-pointer hover:underline opacity-90">
                  How property search work?
                </p>
              </div>
            </div>

            {/* Stats positioned at right center */}
            <div className="absolute top-1/2 right-8 -translate-y-1/2 flex flex-col gap-6">
              <div className="flex items-center gap-3">
                <div className="bg-white text-[#FFBB10] p-2.5 rounded-full">
                  <Home size={32} />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {dashboardData.isLoading
                      ? "Loading..."
                      : dashboardData.totalProperties}
                  </p>
                  <p className="text-xs opacity-90">Total Properties</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="bg-white text-[#FFBB10] p-2.5 rounded-full">
                  <LuGavel size={32} />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {dashboardData.isLoading
                      ? "Loading..."
                      : dashboardData.totalSearches}
                  </p>
                  <p className="text-xs opacity-90">Total Searches</p>
                </div>
              </div>
            </div>
          </div>

          {/* Amount Spent Section */}
          <div className="w-[280px] bg-[#FFBB10] text-white rounded-[30px] p-8 flex flex-col justify-center text-center">
            <h3 className="text-xl font-medium mb-6">Total Amount Spent</h3>
            <p className="text-5xl font-bold">₦{profileCompletion}</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardSummary;
