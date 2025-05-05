"use client";

import React from "react";
import Link from "next/link";

const NoSearchResultPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f5f6fa]">
      <div className="bg-white rounded-xl shadow-lg p-10 flex flex-col items-center max-w-md w-full">
        <svg width="80" height="80" fill="none" viewBox="0 0 24 24" stroke="#f59e42" className="mb-4">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z" />
        </svg>
        <h2 className="text-2xl font-bold mb-2 text-gray-800">No Results Found</h2>
        <p className="text-gray-600 mb-6 text-center">
          Sorry, we couldn't find any properties matching your search.<br />
          Please try again with different criteria or return to the search page.
        </p>
        <Link href="/users">
          <button className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-semibold shadow">
            Try Another Search
          </button>
        </Link>
      </div>
    </div>
  );
};

export default NoSearchResultPage;
