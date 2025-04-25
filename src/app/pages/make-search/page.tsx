"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import NavBar from "@/components/home/Navbar";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PageLoadingAnimation from "@/components/utils/PageLoadingAnimation";

const MakeSearchPage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [searchParams, setSearchParams] = useState<any>(null);

  useEffect(() => {
    // Retrieve the search parameters from sessionStorage
    const params = JSON.parse(sessionStorage.getItem("pendingSearchParams") || '{}');
    setSearchParams(params);
  }, []);

  const handleViewResults = async () => {
    setIsLoading(true);
    
    try {
      if (!searchParams) {
        toast.error("Search parameters not found. Please try searching again.");
        router.push("/pages/search");
        return;
      }

      // Make sure we're using HTTPS for the API endpoint
      const baseUrl = process.env.NEXT_PUBLIC_BASEURL || 'http://147.182.229.165/api';
      const form = new FormData();
      form.append('title_type', searchParams.propertyTitle || '');
      form.append('lga', searchParams.lga || '');
      form.append('state', searchParams.state || '');
      
      const response = await fetch(`${baseUrl}/search-property`, {
        method: 'POST',
        body: form,
      });
      
      if (!response.ok) throw new Error(`Search failed with status: ${response.status}`);
      const result = await response.json();
      
      // Process the result
      if (result && result.data && Array.isArray(result.data) && result.data.length > 0) {
        toast.success("Property found!");
        
        // Map the results to a consistent format
        const mappedResults = result.data.map((item: any) => ({
          id: item.id,
          title: item.property_title,
          owner: item.name_of_owner,
          summary: item.property_location,
          details: item // Store the full item as details
        }));
        
        // Store the results in sessionStorage with the correct key
        sessionStorage.setItem("searchResults", JSON.stringify(mappedResults));
        
        const firstId = mappedResults[0]?.id;
        console.log("Stored mappedResults:", mappedResults, "Redirecting to id:", firstId);
        
        // Redirect based on the first result
        if (firstId) {
          router.push(`/search-details/${firstId}`);
        } else {
          router.push("/pages/search-results");
        }
      } else {
        router.push("/pages/no-search-result");
      }
    } catch (error: any) {
      console.error('API Error:', error);
      // If there's a connection error, show a more specific message
      if (error.message && (
          error.message.includes('Failed to fetch') || 
          error.message.includes('NetworkError') ||
          error.message.includes('ERR_CONNECTION_REFUSED'))) {
        toast.error('Unable to connect to the search server. Please try again later or contact support.');
        
        // Redirect to a fallback page after a delay
        setTimeout(() => {
          router.push("/pages/server-error");
        }, 2000);
      } else {
        toast.error('Search failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f6fa] flex flex-col items-center justify-center relative">
      {isLoading && <PageLoadingAnimation />}
      <ToastContainer />
      <NavBar bgColor="none" backdropBlur="blur(10px)" />
      
      <div className="w-full max-w-4xl min-h-[350px] bg-white rounded-2xl shadow-lg mt-16 flex flex-col justify-center items-center p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Payment Successful!</h1>
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="text-lg text-gray-600 mb-2">
            Your payment has been processed successfully.
          </p>
          <p className="text-md text-gray-500">
            You can now view the search results for your property query.
          </p>
        </div>
        
        <div className="bg-gray-50 p-6 rounded-lg w-full max-w-md mb-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Search Parameters</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Property Title:</span>
              <span className="font-medium">{searchParams?.propertyTitle || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">State:</span>
              <span className="font-medium">{searchParams?.state || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">LGA:</span>
              <span className="font-medium">{searchParams?.lga || 'N/A'}</span>
            </div>
          </div>
        </div>
        
        <button
          onClick={handleViewResults}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition duration-300 shadow-md"
        >
          View Results
        </button>
      </div>
      
      <div className="fixed left-0 right-0 bottom-2 flex justify-center z-10">
        <div className="flex items-center gap-2 text-black text-sm">
          <span>Problems with the search?</span>
          <a href="/pages/contact-us" className="underline font-semibold hover:text-blue-600">Contact Support</a>
        </div>
      </div>
    </div>
  );
};

export default MakeSearchPage;
