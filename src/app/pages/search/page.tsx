"use client"

import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast, ToastContainer  } from "react-toastify";
import { useState, useEffect } from "react";
import "react-toastify/dist/ReactToastify.css";
import Button from "@/components/utils/Button"; // Unused
import Link from "next/link"; // Unused
import NavBar from "@/components/home/Navbar";
import {Modal} from "@/components/utils/Modal";


import SearchForm from "@/components/search/SearchForm";

interface PropertyItem {
  id: string; 
  property_title: string;
  name_of_owner: string;
  property_location: string;
}

const schema = yup.object().shape({
  propertyTitle: yup.string(),
  propertyOwner: yup.string(),
  registerTitle: yup.string(),
  state: yup.string().required("Property Location is required"),
  lga: yup.string().required("Property Location is required"),
  surveyPlanNumber: yup.string(),
  matchedCriteria: yup.string(),
});






const SearchPage = () => {

  const [showSearchResultData, setShowSearchResultData] = useState<any>();
  const [showSearchResult, setShowSearchResult] = useState(false);
  const [showNoResults, setShowNoResults] = useState(false);
 
  const [paymentResponse, setPaymentResponse] = useState(null);
  const [paymentResponseTwo, setPaymentResponseTwo] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [caseData, setCaseData] = useState(null);
  const [showSearchResultThree, setShowSearchResultThree] = useState(false);
  const [showCaseInformationThree, setShowCaseInformationThree] = useState(false);
  const [showPaymentDetailsThree, setShowPaymentDetailsThree] = useState(false);
  const [showPaymentSuccessThree, setShowPaymentSuccessThree] = useState(false);
  const [showSearchSuccessThree, setShowSearchSuccessThree] = useState(false);
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  useEffect(() => {
    if (showSearchResultData?.data?.length > 0) {
      setCaseData(showSearchResultData.data[0]._id);
    }
  }, [showSearchResultData]);
  console.log("id", caseData)

  // React Hook form for form validation
  const {
    handleSubmit,
    formState: { errors },
    watch,
    register,
    reset,
  } = useForm({ resolver: yupResolver(schema) });

  // Submit handler for the form
  const onSubmitHandler = async (data: any) => {
    setIsSearching(true);
    try {
      // Make sure we're using HTTPS for the API endpoint
      const baseUrl = process.env.NEXT_PUBLIC_BASEURL || 'https://147.182.229.165/api';
      const form = new FormData();
      form.append('title_type', data.propertyTitle || '');
      form.append('lga', data.lga || '');
      form.append('state', data.state || '');

      // Store search parameters for later use (after payment)
      sessionStorage.setItem("pendingSearchParams", JSON.stringify({
        propertyTitle: data.propertyTitle || '',
        lga: data.lga || '',
        state: data.state || ''
      }));

      // Check if the API is reachable before redirecting
      try {
        // Simple ping to check if the API is available
        const pingResponse = await fetch(`${baseUrl}/ping`, { 
          method: 'GET',
          mode: 'no-cors',
          // Short timeout to avoid long waits
          signal: AbortSignal.timeout(3000)
        });
        
        // If we get here, the API is likely reachable
        // Redirect user to get-access page before making the API call
        window.location.href = "/pages/get-access";
        return;
      } catch (pingError) {
        console.error('API ping error:', pingError);
        // API is not reachable, show error message
        toast.error('Unable to connect to the search server. Please try again later.');
        setTimeout(() => {
          window.location.href = "/pages/server-error";
        }, 2000);
        return;
      }
    } catch (error: any) {
      console.error('Search error:', error);
      toast.error(error.message || 'Search failed. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

 

  
  const handleShowPaymentDetailsThree = () => {
    if (!hasSearchResults) {
      toast.error('No property found to make payment for. Please try a different search.');
      return;
    }
    setShowPaymentDetailsThree(true);
  };

  // Handler for payment success to update access state
  

  // Reset search function
  const handleResetSearch = () => {
    setShowNoResults(false);
    setShowSearchResultData(undefined);
    setPaymentCompleted(false);
  };

  // Helper to check if there are search results
  const hasSearchResults = Array.isArray(showSearchResultData?.data) && showSearchResultData?.data.length > 0;

  return(
    <>
    <div className="h-screen bg-red-80">
      <div className="max-w-[1100px] mx-auto h-full flex flex-col">
        {/* ====== Navbar component ======= */}
        <section>
          <NavBar bgColor="none" backdropBlur="blur(10px)" />
        </section>

        {/* ====== Main Content goes here ====== */}
        <section className="pt-19 sm:pt-[6rem] md:pt-30 mx-2 md:mx-6 h-full font-Chillax">
          <section className="md:grid md:grid-cols-2 w-full">
            {/* ====== First Column ====== */}
            <div className="mt-20 mb-10 flex flex-col items-center md:items-start md:mt-24 md:mb-0 w-full">
              <h1 className="text-[#000] text-[1.5rem] font-medium sm:text-[2.4rem] md:text-[2.625rem] whitespace-pre-line">
                Get a better search{"\n"}experience
              </h1>
              <p className="text-[#000] font-medium leading-[2.5rem] text-[0.8rem] sm:text-[0.98rem] sm:leading-[2.7rem] md:text-[1.25rem] md:leading-[3rem]">
                Sign in for free
              </p>
              <div>
                <Button>
                  <Link href="/pages/signup">Sign Up</Link>
                </Button>
                <Button>
                  <Link href="/pages/signin">Login</Link>
                </Button>
              </div>
              <div>
                {/* <Button>
                  <Link href="/pages/signup">Sign Up</Link>
                </Button>
                <Button>
                  <Link href="/pages/signin">Login</Link>
                </Button> */}
              </div>
            </div>

            {/* ====== Second Column ====== */}
            <div className="w-full">
              <form onSubmit={handleSubmit(onSubmitHandler)}>
                <SearchForm
                  register={register}
                  errors={errors}
                  watch={watch}
                  isSearching={isSearching}
                />
              </form>
              
              {/* Test button - can be removed in production */}
              
            </div>
          </section>
          
          {/* === No Results Modal === */}
          <Modal
            show={showNoResults}
            onClose={() => setShowNoResults(false)}
          >
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">No Results Found</h3>
              <p className="text-gray-600 mb-6">
                We couldn't find any properties matching your search criteria. Please try again with different parameters.
              </p>
              <div className="flex justify-end">
                <button
                  onClick={handleResetSearch}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Try Another Search
                </button>
              </div>
            </div>
          </Modal>
          
          
          

          {/* Only show detailed search results after payment */}
          

       
          

          {/* ===Success Search screen=== */}
       

          {/* SEARCH AND REPORT LOGIC */}
          {/* ===Payment details screen for search and report=== */}
        

        

          {/* search and report - only show after payment */}
          
          
           
         
          
         
        </section>  
      </div>
    </div>
    <ToastContainer />
  </>

  );

};

export default SearchPage;