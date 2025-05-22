"use client";

import { useState, useEffect } from "react";
import type React from "react";
import { GetDashboardSummary } from "@/Services/AuthRequest/auth.request";
import { AlertCircle, Loader2 } from "lucide-react";

interface StatItem {
  icon: React.ReactNode;
  value: number;
  label: string;
}

const StatsBar: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [summaryData, setSummaryData] = useState<{
    total_searches: number;
    total_pending: number;
    total_on_appeal: number;
    total_concluded: number;
  } | null>(null);

  // Fetch dashboard summary data
  useEffect(() => {
    const fetchDashboardSummary = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await GetDashboardSummary();
        if (response.success && response.data) {
          setSummaryData(response.data);
        } else {
          setError(response.error || 'Failed to fetch dashboard summary');
        }
      } catch (err) {
        console.error('Error fetching dashboard summary:', err);
        setError('An error occurred while fetching dashboard data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardSummary();
  }, []);

  // Default stats with icons
  const stats: StatItem[] = [
    {
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M20 3H4C2.89543 3 2 3.89543 2 5V15C2 16.1046 2.89543 17 4 17H20C21.1046 17 22 16.1046 22 15V5C22 3.89543 21.1046 3 20 3Z"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M8 21H16"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M12 17V21"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
      value: 4657,
      label: "Total searches",
    },
    {
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 7V12L15 15"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
      value: 2156,
      label: "Total pending",
    },
    {
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
      value: 1089,
      label: "Total On appeal",
    },
    {
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 8L16 12L12 16"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M4 12H16"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M19 6V18"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
      value: 1113,
      label: "Total Dismissed",
    },
  ];

  // Combine default stats with API data
  const displayStats = stats.map((stat, index) => {
    let value = stat.value; // Default value
    
    // Update values with real data if available
    if (summaryData) {
      if (index === 0) value = summaryData.total_searches || 0;
      if (index === 1) value = summaryData.total_pending || 0;
      if (index === 2) value = summaryData.total_on_appeal || 0;
      if (index === 3) value = summaryData.total_concluded || 0;
    }
    
    return {
      ...stat,
      value
    };
  });

  return (
    <div className="relative rounded-2xl overflow-hidden">
      {/* Blue border effect */}
      <div className="absolute inset-0 bg-blue-400 rounded-2xl p-[2px]">
        <div className="absolute inset-0 bg-[#23A863] rounded-2xl"></div>
      </div>

      {/* Stats content */}
      <div className="relative flex flex-wrap justify-between items-center w-full px-4 sm:px-8 py-4 sm:py-6 text-white">
        {isLoading ? (
          <div className="flex items-center justify-center w-full py-4">
            <Loader2 className="h-6 w-6 text-white animate-spin mr-2" />
            <span>Loading dashboard data...</span>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center w-full py-4">
            <AlertCircle className="h-6 w-6 text-red-300 mr-2" />
            <span>{error}</span>
          </div>
        ) : (
          displayStats.map((stat, idx) => (
            <div
              key={idx}
              className="flex items-center space-x-3 py-2 sm:py-0 w-full sm:w-auto"
            >
              <div className="flex-shrink-0">{stat.icon}</div>
              <div className="flex flex-col">
                <span className="text-xl sm:text-2xl font-bold leading-none">
                  {stat.value}
                </span>
                <span className="text-xs text-gray-300 mt-1">{stat.label}</span>
              </div>

              {/* Divider line */}
              {idx < displayStats.length - 1 && (
                <div className="hidden sm:block w-px h-12 bg-white/30 mx-4"></div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default StatsBar;
