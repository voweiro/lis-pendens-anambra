"use client";

import React, { Suspense } from "react";
import NavBar from "@/components/home/Navbar";
import Link from "next/link";

function ServerErrorContent() {
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar bgColor="none" backdropBlur="blur(10px)" />
      
      <div className="flex-grow flex flex-col items-center justify-center px-4 py-16">
        <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8 text-center">
          <h1 className="text-3xl font-bold text-red-600 mb-4">Server Connection Error</h1>
          
          <div className="mb-6">
            <svg className="w-16 h-16 mx-auto text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
            </svg>
          </div>
          
          <p className="text-gray-700 mb-6">
            We're unable to connect to the search server at this time. This could be due to:
          </p>
          
          <ul className="text-left text-gray-600 mb-8 pl-6 list-disc">
            <li className="mb-2">Temporary server maintenance</li>
            <li className="mb-2">Network connectivity issues</li>
            <li className="mb-2">High server traffic</li>
          </ul>
          
          <div className="flex flex-col space-y-4">
            <Link href="/" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors">
              Return to Home
            </Link>
            
            <Link href="/pages/search" className="inline-block bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded transition-colors">
              Try Again
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ServerErrorPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ServerErrorContent />
    </Suspense>
  );
}
