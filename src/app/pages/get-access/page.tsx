"use client";

import React, { useEffect } from "react";
import NavBar from "@/components/home/Navbar";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Move this to .env.local for better security
const FLW_PUBLIC_KEY = "FLWPUBK_TEST-3b48e543af90cfc1a33822d02376a17b-X";

const GetAccessPage = () => {
  const router = useRouter();

  // Improved Flutterwave payment handler
  const handleFlutterwavePayment = () => {
    // Generate a unique transaction reference
    const txRef = "tx-" + Date.now() + "-" + Math.floor(Math.random() * 1000000);
    
    // @ts-ignore
    window.FlutterwaveCheckout({
      public_key: FLW_PUBLIC_KEY,
      tx_ref: txRef,
      amount: 200,
      currency: "NGN",
      payment_options: "card,ussd,banktransfer",
      customer: {
        email: "ajenaghonorevoweiro@email.com",
        name: "Ajenagho Norevoweiro",
      },
      callback: async function (data: any) {
        // After successful payment, redirect to the make-search page
        try {
          toast.success("Payment successful!");
          
          // Short delay before redirecting to make-search page
          setTimeout(() => {
            window.location.href = "/pages/make-search";
          }, 1200);
        } catch (error) {
          console.error('Error after payment:', error);
          toast.error('An unexpected error occurred. Please try again.');
        }
      },
      onclose: function () {
        toast.info("Payment window closed");
      },
      customizations: {
        title: "Les-Pendes Access Payment",
        description: "Payment for access to Les-Pendes services",
        logo: "https://les-pendes-n1ss.vercel.app/lis-pendens-logo.png",
      },
    });
  };

  useEffect(() => {
    if (!window.FlutterwaveCheckout) {
      const script = document.createElement("script");
      script.src = "https://checkout.flutterwave.com/v3.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#f5f6fa] flex flex-col items-center justify-center relative">
      <ToastContainer />
      <NavBar bgColor="none" backdropBlur="blur(10px)" />
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
              When a payment is made a user can access all information related to search but can only download one.<br />
              <span className="text-yellow-300 font-semibold block mt-2">After successful payment, please close the payment window to view your results.</span>
            </div>
          </div>
          <button
            className="bg-white text-black font-semibold rounded-md px-8 py-3 ml-0 md:ml-8 mt-2 md:mt-0 transition hover:bg-gray-200 shadow"
            onClick={handleFlutterwavePayment}
          >
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