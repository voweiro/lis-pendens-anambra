"use client";
import NormalUserLayout from "@/components/users/layout";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import NavBar from "@/components/home/Navbar";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PageLoadingAnimation from "@/components/utils/PageLoadingAnimation";
import UserTopbar from "@/components/users/dashboard/UserTopbar";
import UserSidebar from "@/components/users/User-Sidebar";
import useAuth from "@/hooks/useAuth";

const MakeSearchPage = () => {
  const router = useRouter();
  const { auth } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [searchParams, setSearchParams] = useState<any>(null);

  useEffect(() => {
    // Retrieve the search parameters from sessionStorage
    const paramsString = sessionStorage.getItem("pendingSearchParams");
    const params = paramsString ? JSON.parse(paramsString) : null;
    setSearchParams(params);
  }, []);

  const handleViewResults = async () => {
    setIsLoading(true);
    try {
      // Get user ID and auth token
      const userId = auth?.user_id || sessionStorage.getItem("user_id");
      const authToken =
        auth?.accessToken ||
        (sessionStorage.getItem("auth")
          ? JSON.parse(sessionStorage.getItem("auth") || "{}").accessToken
          : null);

      if (!userId || !authToken) {
        toast.error("Authentication required. Please log in again.");
        router.push("/pages/signin");
        return;
      }

      // Check for search results in session storage
      const storedResults = sessionStorage.getItem("searchResults");
      if (!storedResults) {
        toast.error("Search results not found. Please try searching again.");
        router.push("/users/dashboard");
        return;
      }

      // Check if we have payment info
      const paymentInfo = sessionStorage.getItem("paymentInfo");
      if (!paymentInfo) {
        toast.error(
          "Payment information not found. Please complete payment first."
        );
        router.push("/users/dashboard");
        return;
      }

      // Skip all the search parameter checks and history saving
      toast.success("Redirecting to your search results...");

      // Small delay to show the success message
      setTimeout(() => {
        router.push("/users/user-search-result");
      }, 1000);
    } catch (error: any) {
      if (
        error.message &&
        (error.message.includes("Failed to fetch") ||
          error.message.includes("Network request failed"))
      ) {
        toast.error(
          "Network error. Please check your connection and try again."
        );
      } else {
        toast.error(error.message || "An unexpected error occurred");
      }
      console.error("Error during search:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <NormalUserLayout title="Access Your Search Results">
      <div className="flex h-screen">
        <div className="flex-1 flex flex-col">
          <div className="min-h-screen bg-[#f5f6fa] flex flex-col items-center justify-center relative">
            {isLoading && <PageLoadingAnimation />}
            <ToastContainer />
            {/* <NavBar bgColor="none" backdropBlur="blur(10px)" /> */}
            <div className="w-full max-w-4xl min-h-[350px] bg-white rounded-2xl shadow-lg mt-16 flex flex-col justify-center items-center p-8">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-4">
                  Payment Successful!
                </h1>
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-10 w-10 text-green-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <p className="text-lg text-gray-600 mb-2">
                  Your payment has been processed successfully.
                </p>
                <p className="text-md text-gray-500 mb-8">
                  You can now view the search results for your property query.
                </p>
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
                <a
                  href="/pages/contact-us"
                  className="underline font-semibold hover:text-blue-600"
                >
                  Contact Support
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </NormalUserLayout>
  );
};

export default MakeSearchPage;
