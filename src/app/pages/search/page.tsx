"use client"

import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import { useState, useEffect } from "react";
import "react-toastify/dist/ReactToastify.css";
import SearchForm from "@/components/search/SearchForm"
import Button from "@/components/utils/Button";
import Link from "next/link"; 
import NavBar from "@/components/home/Navbar";




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

    const [showSearchResultData, setShowSearchResultData] = useState();
  const [showSearchResult, setShowSearchResult] = useState(false);
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

  useEffect(() => {
    if (showSearchResultData?.data?.cases?.length > 0) {
      setCaseData(showSearchResultData.data.cases[0]._id);
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
  const onSubmitHandler = async (data) => {
    setIsSearching(true);
    const body = {
      propertyTitle: data?.propertyTitle,
      propertyOwner: data?.propertyOwner,
      registeredTitleNumber: data?.registerTitle,
      state: data?.state,
      lga: data?.lga,
      surveyPlanNumber: data?.surveyPlanNumber,
      matchedCriteria: data?.matchedCriteria,
    };

    try {
      const response = await SearchByValuesRequest(body);
      setShowSearchResultData(response);
      toast.success("Search Successful");
      setTimeout(() => {
        setShowSearchResult(true);
      }, 3000);
    } catch (error) {
      console.log(error?.response?.data?.message);
      toast.error(error?.response?.data?.message);
    } finally {
      setIsSearching(false);
    }
  };


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
                  <Button >
                    <Link href="/pages/signup">Sign Up</Link>
                  </Button>
                  <Button >
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
              </div>
            </section>

            
            
            
           
             
           
          </section>  
        </div>
      </div>



    </>

  );

  };



export default SearchPage;