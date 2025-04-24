"use client"

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import NavBar from "@/components/home/Navbar";

const SearchResultPage = () => {
  const [results, setResults] = useState<any[]>([]);
  const [relatedSearches, setRelatedSearches] = useState<string[]>(["Abeokuta area counsel wuse2"]);
  const router = useRouter();

  useEffect(() => {
    // Retrieve search result from localStorage
    const stored = localStorage.getItem("searchResultData");
    if (stored) {
      const parsed = JSON.parse(stored);
      setResults(parsed.data || []);
      // Optionally: set related searches from parsed if available
    } else {
      // If no data, redirect back to search page
      router.replace("/pages/search");
    }
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center">
        <NavBar/>
      <div className="bg-[#f5f6fa] rounded-[24px] border border-gray-200 w-full max-w-[1084px] h-[690px] mt-[104px] mx-auto shadow-md p-0">
        {/* Summary bar */}
        <div className="flex items-center justify-between rounded-xl bg-[#e9eaee] px-6 py-4 m-6 mb-0">
          <span className="font-semibold text-base">
            Access full {results.length} searched info and related updates
          </span>
          <button
            className="bg-black text-white px-7 py-2 rounded-xl font-semibold hover:bg-gray-800 transition"
            onClick={() => router.push('/pages/get-access')}
            style={{ boxShadow: '0 2px 8px 0 rgba(0,0,0,0.06)' }}
          >
            Get access
          </button>
        </div>
        {/* Results */}
        <div className="px-6 pt-6">
          {results.slice(0, 2).map((item, idx) => (
            <div key={idx}>
              <div className="font-bold text-lg mb-1">
                {item.property_title || 'Untitled'}
              </div>
              <div className="flex flex-wrap gap-8 text-sm mb-4">
                <span className="text-[#222]">Name of owner: <span className="font-normal">{item.name_of_owner || 'Unknown'}</span></span>
                <span className="text-[#222]">Survey plan number: <span className="font-normal">{item.survey_plan_no || 'N/A'}</span></span>
              </div>
              {idx < Math.min(1, results.length - 1) && (
                <hr className="border-t border-gray-200 mb-4" />
              )}
            </div>
          ))}
        </div>
        {/* More results link */}
        {results.length > 2 && (
          <div className="px-6 pb-2 pt-2">
            <span className="text-[#7C3AED] font-medium text-base cursor-pointer">
              more results from searched info »
            </span>
          </div>
        )}
        {/* Related Searches */}
        <div className="px-6 pb-6 pt-4">
          <hr className="border-t border-gray-200 mb-4" />
          <div className="font-bold text-base mb-2">Related Searches:</div>
          <div className="text-gray-400 text-base">
            {relatedSearches.length > 0
              ? relatedSearches.join(", ")
              : "Abeokuta area counsel wuse2"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchResultPage;
