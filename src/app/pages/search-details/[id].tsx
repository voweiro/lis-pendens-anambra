"use client";

import React from "react";
import SearchDetailView from "@/components/search/SearchDetailView";

const SearchDetailsPage = () => {
  return (
    <div className="min-h-screen bg-[#f5f6fa] flex flex-col items-center justify-center relative">
      <div className="w-full max-w-4xl min-h-[350px] bg-white bg-opacity-60 rounded-2xl shadow-lg mt-16 flex flex-col justify-center items-center p-8 backdrop-blur-sm">
        <SearchDetailView />
      </div>
    </div>
  );
};

export default SearchDetailsPage;
