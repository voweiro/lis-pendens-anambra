"use client"

import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast, ToastContainer  } from "react-toastify";
import { useState, useEffect } from "react";
import "react-toastify/dist/ReactToastify.css";
import Button from "@/components/utils/Button";
import Link from "next/link"; 
import NavBar from "@/components/home/Navbar";
import {Modal} from "@/components/utils/Modal";
import {AccessModal} from "@/components/utils/AccessModal";
import {CaseResultModal} from "@/components/utils/CaseResultModal";
import {CaseInformationModal} from "@/components/utils/CaseInformationModal";
import {SearchPageLayout} from "@/components/search/SearchPageLayout";
import{ BlurredSearchLayout} from "@/components/search/BlurredSearchLayout";
import {PaymentDetails }from "@/components/search/PaymentDetails";
import {PaymentSuccess} from "@/components/search/PaymentSuccess";
import {SearchPageLayoutTwo} from "@/components/search/SearchPageLayoutTwo";
import {CaseInformation} from "@/components/search/CaseInformation";
import {BlurredSearchLayoutTwo} from "@/components/search/BlurredSearchLayoutTwo";
import {PaymentDetailsTwo} from "@/components/search/PaymentDetailsTwo";
import {PaymentSuccessTwo} from "@/components/search/PaymentSuccessTwo";
import {DownloadRecordTwo} from "@/components/search/DownloadRecordTwo";
import {SearchSuccessTwo }from "@/components/search/SearchSuccessTwo";
import {PaymentDetailsThree} from "@/components/search/PaymentDetailsThree";
import {PaymentSuccessThree} from "@/components/search/PaymentSuccessThree";
import {SearchPageLayoutThree} from "@/components/search/SearchPageLayoutThree";
import {CaseInformationThree} from "@/components/search/CaseInformationThree";
import {DownloadRecordThree} from "@/components/search/DownloadRecordThree";
import {SearchSuccessThree} from "@/components/search/SearchSuccessThree";
import SearchForm from "@/components/search/SearchForm";



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
  const [showSearchResultTwo, setShowSearchResultTwo] = useState(false);
  const [selectedCaseData, setSelectedCaseData] = useState(null);
  const [showBlurredScreenTwo, setShowBlurredScreenTwo] = useState(false);
  const [showBlurredScreen, setShowBlurredScreen] = useState(false);
  const [showCaseInformation, setShowCaseInformation] = useState(false);
  const [showPaymentDetails, setShowPaymentDetails] = useState(false);
  const [showPaymentDetailsTwo, setShowPaymentDetailsTwo] = useState(false);
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false);
  const [showPaymentSuccessTwo, setShowPaymentSuccessTwo] = useState(false);
  const [showSearchSuccessTwo, setShowSearchSuccessTwo] = useState(false);
  const [showDownloadAndEmail, setShowDownloadAndEmail] = useState(false);
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
  } = useForm({ resolver: yupResolver(schema) });

  // Submit handler for the form
  const onSubmitHandler = async (data: any) => {
    setIsSearching(true);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_BASEURL;
      const form = new FormData();
      form.append('title_type', data.propertyTitle || '');
      form.append('lga', data.lga || '');
      form.append('state', data.state || '');

      const response = await fetch(`${baseUrl}/search-property`, {
        method: 'POST',
        body: form,
      });
      if (!response.ok) throw new Error('Search failed');
      const result = await response.json();
      console.log('SEARCH API RESULT:', result); // DEBUG LINE
      setShowSearchResultData(result);
      if (Array.isArray(result.data) && result.data.length > 0) {
        toast.success("Property found!");
        localStorage.setItem("searchResultData", JSON.stringify(result));
        window.location.href = "/pages/search-result";
      } else {
        toast.info("No properties found matching your search criteria.");
        setShowNoResults(true);
      }
    } catch (error) {
      toast.error('Search failed. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleShowPaymentDetails = () => {
    if (!hasSearchResults) {
      toast.error('No property found to make payment for. Please try a different search.');
      return;
    }
    setShowPaymentDetails(true);
  };

  const handleShowPaymentDetailsTwo = () => {
    if (!hasSearchResults) {
      toast.error('No property found to make payment for. Please try a different search.');
      return;
    }
    setShowPaymentDetailsTwo(true);
  };

  const handleShowPaymentDetailsThree = () => {
    if (!hasSearchResults) {
      toast.error('No property found to make payment for. Please try a different search.');
      return;
    }
    setShowPaymentDetailsThree(true);
  };

  // Handler for payment success to update access state
  const handlePaymentSuccess = () => {
    setPaymentCompleted(true);
    setShowPaymentSuccess(true);
  };

  // Reset search function
  const handleResetSearch = () => {
    setShowNoResults(false);
    reset({
      title_type: "survey" // Keep the default value when resetting
    });
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
          <NavBar />
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
          
          {/* ===Show Blurred screen=== */}
          <AccessModal
            show={showBlurredScreen}
            onClose={() => setShowBlurredScreen(false)}
          >
            <section className="bg-[#ebeef5] flex flex-col items-center mx-[10px] md:p-[8px] overflow-hidden">
              <BlurredSearchLayout
                setShowBlurredScreen={setShowBlurredScreen}
                setShowPaymentDetails={handleShowPaymentDetails}
                setShowPaymentDetailsThree={handleShowPaymentDetailsThree}
              />
            </section>
          </AccessModal>

          {/* ===Payment details screen=== */}
          <AccessModal
            show={showPaymentDetails}
            onClose={() => setShowPaymentDetails(false)}
          >
            <PaymentDetails
              setShowPaymentDetails={setShowPaymentDetails}
              setShowPaymentSuccess={handlePaymentSuccess}
              selectedCaseData={selectedCaseData}
              setPaymentResponse={setPaymentResponse}
            />
          </AccessModal>

          {/* ===Success Payment screen=== */}
          <AccessModal
            show={showPaymentSuccess}
            onClose={() => setShowPaymentSuccess(false)}
          >
            <PaymentSuccess
              showSearchResultData={showSearchResultData}
              setShowPaymentSuccess={setShowPaymentSuccess}
              setShowCaseInformation={setShowCaseInformation}
              setShowSearchResultTwo={setShowSearchResultTwo}
            />
          </AccessModal>

          {/* Only show detailed search results after payment */}
          <CaseResultModal
            show={showSearchResultTwo && paymentCompleted}
            onClose={() => setShowSearchResultTwo(false)}
          >
            <SearchPageLayoutTwo
              setShowSearchResultTwo={setShowSearchResultTwo}
              showSearchResultData={showSearchResultData}
              setSelectedCaseData={setSelectedCaseData}
              selectedCaseData={selectedCaseData}
              setShowCaseInformation={setShowCaseInformation}
            />
          </CaseResultModal>

          {/* ===Show case information=== */}
          <CaseInformationModal
            show={showCaseInformation && paymentCompleted}
            onClose={() => {
              setShowCaseInformation(false);
              setShowSearchResultTwo(true);
            }}
          >
            <section className="bg-[#ebeef5] pb-6">
              <CaseInformation
                selectedCaseData={selectedCaseData}
                setShowDownloadAndEmail={setShowDownloadAndEmail}
                setShowBlurredScreenTwo={setShowBlurredScreenTwo}
                setShowCaseInformation={setShowCaseInformation}
                setShowSearchResultTwo={setShowSearchResultTwo}
              />
            </section>
          </CaseInformationModal>

          {/* ===Show Blurred screen=== */}
          <AccessModal
            show={showBlurredScreenTwo}
            onClose={() => setShowBlurredScreenTwo(false)}
          >
            <section className="bg-[#ebeef5] flex flex-col items-center mx-[10px] md:p-[8px] overflow-hidden">
              <BlurredSearchLayoutTwo
                setShowBlurredScreenTwo={setShowBlurredScreenTwo}
                setShowPaymentDetailsTwo={handleShowPaymentDetailsTwo}
              />
            </section>
          </AccessModal>

          {/* ===Payment details screen=== */}
          <AccessModal
            show={showPaymentDetailsTwo}
            onClose={() => setShowPaymentDetailsTwo(false)}
          >
            <PaymentDetailsTwo
              setShowPaymentDetailsTwo={setShowPaymentDetailsTwo}
              setShowPaymentSuccessTwo={setShowPaymentSuccessTwo}
              selectedCaseData={selectedCaseData}
              setPaymentResponseTwo={setPaymentResponseTwo}
            />
          </AccessModal>

          {/* ===Success Payment screen=== */}
          <AccessModal
            show={showPaymentSuccessTwo}
            onClose={() => setShowPaymentSuccessTwo(false)}
          >
            <PaymentSuccessTwo
              setShowPaymentSuccessTwo={setShowPaymentSuccessTwo}
              setShowDownloadAndEmail={setShowDownloadAndEmail}
            />
          </AccessModal>

          {/* ===Download and Send Email modal ==== */}
          <Modal
            show={showDownloadAndEmail && paymentCompleted}
            onClose={() => setShowDownloadAndEmail(false)}
          >
            <DownloadRecordTwo
              setShowDownloadAndEmail={setShowDownloadAndEmail}
              userId={paymentResponseTwo?.data?.userId}
              referenceId={paymentResponseTwo?.data?.reference}
              setShowSearchSuccessTwo={setShowSearchSuccessTwo}
            />
          </Modal>

          {/* ===Success Search screen=== */}
          <AccessModal
            show={showSearchSuccessTwo}
            onClose={() => setShowSearchSuccessTwo(false)}
          >
            <SearchSuccessTwo setShowSearchSuccessTwo={setShowSearchSuccessTwo} />
          </AccessModal>

          {/* SEARCH AND REPORT LOGIC */}
          {/* ===Payment details screen for search and report=== */}
          <AccessModal
            show={showPaymentDetailsThree}
            onClose={() => setShowPaymentDetailsThree(false)}
          >
            <PaymentDetailsThree
              setShowPaymentDetailsThree={setShowPaymentDetailsThree}
              setShowPaymentSuccessThree={setShowPaymentSuccessThree}
              caseData={caseData}
              setPaymentResponse={setPaymentResponse}
            />
          </AccessModal>

          {/* ===Success Payment screen for search and report=== */}
          <AccessModal
            show={showPaymentSuccessThree}
            onClose={() => setShowPaymentSuccessThree(false)}
          >
            <PaymentSuccessThree
              showSearchResultData={showSearchResultData}
              setShowPaymentSuccessThree={setShowPaymentSuccessThree}
              setShowCaseInformation={setShowCaseInformation}
              setShowSearchResultThree={setShowSearchResultThree}
            />
          </AccessModal>

          {/* search and report - only show after payment */}
          <CaseResultModal
            show={showSearchResultThree && paymentCompleted}
            onClose={() => setShowSearchResultThree(false)}
          >
            <SearchPageLayoutThree
              setShowSearchResultThree={setShowSearchResultThree}
              showSearchResultData={showSearchResultData}
              setSelectedCaseData={setSelectedCaseData}
              selectedCaseData={selectedCaseData}
              setShowCaseInformationThree={setShowCaseInformationThree}
            />
          </CaseResultModal>

          {/* ===Show case information=== */}
          <CaseInformationModal
            show={showCaseInformationThree && paymentCompleted}
            onClose={() => {
              setShowCaseInformationThree(false);
              setShowDownloadAndEmail(true);
            }}
          >
            <section className="bg-[#ebeef5] pb-6">
              <CaseInformationThree
                selectedCaseData={selectedCaseData}
                setShowDownloadAndEmail={setShowDownloadAndEmail}
                setShowCaseInformationThree={setShowCaseInformationThree}
                setShowSearchResultTwo={setShowSearchResultTwo}
              />
            </section>
          </CaseInformationModal>

          {/* ===Download and Send Email modal for search and report ==== */}
          <Modal
            show={showDownloadAndEmail && paymentCompleted}
            onClose={() => setShowDownloadAndEmail(false)}
          >
            <DownloadRecordThree
              setShowDownloadAndEmail={setShowDownloadAndEmail}
              userId={paymentResponseTwo?.data?.userId}
              referenceId={paymentResponseTwo?.data?.reference}
              setShowSearchSuccessThree={setShowSearchSuccessThree}
            />
          </Modal>
          
          {/* ===Success Search screen=== */}
          <AccessModal
            show={showSearchSuccessThree}
            onClose={() => setShowSearchSuccessThree(false)}
          >
            <SearchSuccessThree setShowSearchSuccessThree={setShowSearchSuccessThree} />
          </AccessModal>
        </section>  
      </div>
    </div>
    <ToastContainer />
  </>

  );

  };



export default SearchPage;