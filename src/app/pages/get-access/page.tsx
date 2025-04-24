"use client";

import React from "react";
import NavBar from "@/components/home/Navbar";

const GetAccessPage = () => {
  return (
    <div className="min-h-screen bg-[#f5f6fa] flex flex-col items-center justify-center relative">
      <NavBar/>
      {/* Main blurred card */}
      <div className="w-full max-w-4xl min-h-[350px] bg-white bg-opacity-60 rounded-2xl shadow-lg mt-16 flex flex-col justify-center items-center p-8 backdrop-blur-sm">
        {/* Example blurred content (replace with actual content if needed) */}
        <div className="w-full h-48 flex flex-col gap-6 opacity-60 filter blur-sm select-none">
          <div className="h-12 bg-gray-300 rounded-md w-3/4 mx-auto" />
          <div className="h-10 bg-gray-300 rounded-md w-1/2 mx-auto" />
          <div className="h-10 bg-gray-300 rounded-md w-2/3 mx-auto" />
          <div className="h-10 bg-gray-300 rounded-md w-2/3 mx-auto" />
        </div>
      </div>

      {/* Note and Payment Section */}
      <div className="fixed left-0 right-0 bottom-10 flex justify-center z-20">
        <div className="flex flex-col md:flex-row items-center justify-between bg-[#232323] text-white rounded-2xl px-8 py-6 w-[90vw] max-w-4xl shadow-lg">
          <div className="flex-1 mb-4 md:mb-0">
            <div className="font-bold text-lg mb-1">Please note this!</div>
            <div className="text-sm opacity-90">
              When a payment is made a user can access all information related to search but can only download one.
            </div>
          </div>
          <button className="bg-white text-black font-semibold rounded-md px-8 py-3 ml-0 md:ml-8 mt-2 md:mt-0 transition hover:bg-gray-200 shadow">
            Make Payment
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="fixed left-0 right-0 bottom-2 flex justify-center z-10">
        <div className="flex items-center gap-2 text-black text-sm">
          <span>Problems with the Informations?</span>
          <a href="#" className="underline font-semibold hover:text-blue-600">Let us Know</a>
        </div>
      </div>
    </div>
  );
};

export default GetAccessPage;