"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import UserTopbar from "@/components/users/dashboard/UserTopbar";
import UserSidebar from "@/components/users/User-Sidebar";
import { VerifyPayment } from "@/Services/AuthRequest/auth.request";
import { Loader2, CheckCircle, XCircle } from "lucide-react";

const PaymentVerificationPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [verifying, setVerifying] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [paymentDetails, setPaymentDetails] = useState<any>(null);

  useEffect(() => {
    const verifyPaymentStatus = async () => {
      try {
        // Get the reference from URL query parameters
        const reference = searchParams.get("reference");
        
        if (!reference) {
          // Try to get reference from session storage
          const paymentInfoStr = sessionStorage.getItem("paymentInfo");
          if (paymentInfoStr) {
            try {
              const paymentInfo = JSON.parse(paymentInfoStr);
              if (paymentInfo.transaction_id) {
                await handleVerification(paymentInfo.transaction_id);
                return;
              }
            } catch (error) {
              console.error("Error parsing payment info:", error);
            }
          }
          
          throw new Error("Payment reference not found");
        }
        
        await handleVerification(reference);
      } catch (error: any) {
        console.error("Payment verification error:", error);
        setError(error.message || "Payment verification failed");
        setVerifying(false);
        setSuccess(false);
        toast.error("Payment verification failed. Please try again.");
      }
    };

    verifyPaymentStatus();
  }, [searchParams, router]);

  // Maximum number of retries and delay between retries
  const MAX_RETRIES = 15;
  const RETRY_DELAY = 6000; // 3 seconds
  
  const handleVerification = async (reference: string, retryCount = 0) => {
    try {
      // Call the verification API
      const response = await VerifyPayment(reference);
      
      console.log(`Verification attempt ${retryCount + 1} response:`, response);
      
      if (response.status === "success") {
        // Payment verified successfully
        setSuccess(true);
        setPaymentDetails(response.data);
        
        // Store the verified payment details
        sessionStorage.setItem("verifiedPayment", JSON.stringify({
          reference,
          amount: response.data?.amount || 0,
          status: "verified",
          date: new Date().toISOString(),
          details: response.data
        }));
        
        toast.success("Payment verified successfully");
        
        // Redirect to search results after a delay
        setTimeout(() => {
          router.push("/users/make-search");
        }, 3000);
      } else if (response.message?.includes("Awaiting Paygate confirmation") || 
                response.message?.includes("payment gateway") || 
                response.status === 500) {
        // Payment is still being processed by the payment gateway
        // Retry after delay if we haven't exceeded max retries
        if (retryCount < MAX_RETRIES) {
          console.log(`Payment still processing. Retrying in ${RETRY_DELAY/1000} seconds... (Attempt ${retryCount + 1}/${MAX_RETRIES})`);
          
          // Update UI to show we're waiting for confirmation
          setError(`Waiting for payment confirmation... (Attempt ${retryCount + 1}/${MAX_RETRIES})`);
          
          // Retry after delay
          setTimeout(() => {
            handleVerification(reference, retryCount + 1);
          }, RETRY_DELAY);
        } else {
          // Max retries exceeded
          setError("Payment verification timed out. Please check your payment status later.");
          setVerifying(false);
        }
      } else {
        // Other error
        throw new Error(response.message || "Payment verification failed");
      }
    } catch (error: any) {
      console.error("Verification error:", error);
      
      // If it's a network error or 500 error, retry
      if ((error.message?.includes("network") || 
          error.response?.status === 500 || 
          error.message?.includes("timeout")) && 
          retryCount < MAX_RETRIES) {
        
        console.log(`Network or server error. Retrying in ${RETRY_DELAY/1000} seconds... (Attempt ${retryCount + 1}/${MAX_RETRIES})`);
        
        // Update UI to show we're retrying
        setError(`Connection error. Retrying... (Attempt ${retryCount + 1}/${MAX_RETRIES})`);
        
        // Retry after delay
        setTimeout(() => {
          handleVerification(reference, retryCount + 1);
        }, RETRY_DELAY);
      } else {
        // Final error after retries or non-retryable error
        setError(error.message || "Payment verification failed");
        setSuccess(false);
        setVerifying(false);
      }
    }
  };

  return (
    <div className="flex h-screen">
      <UserSidebar />
      <div className="flex-1 flex flex-col">
        <UserTopbar title="Payment Verification" />
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
          <div className="bg-white shadow-lg rounded-xl p-8 max-w-md w-full text-center">
            <h1 className="text-2xl font-bold mb-4">Payment Verification</h1>
            
            {verifying ? (
              <div className="flex flex-col items-center justify-center py-8">
                <Loader2 className="h-12 w-12 text-[#23A863] animate-spin mb-4" />
                <p className="text-gray-700">Verifying your payment...</p>
              </div>
            ) : success ? (
              <div className="space-y-6">
                <div className="flex flex-col items-center justify-center py-4">
                  <CheckCircle className="h-16 w-16 text-[#23A863] mb-4" />
                  <p className="text-xl font-semibold text-[#23A863]">Payment Verified Successfully</p>
                  <p className="text-gray-600 mt-2">You will be redirected to your search results shortly...</p>
                </div>
                
                {paymentDetails && (
                  <div className="bg-gray-50 rounded-lg p-4 text-left mt-6">
                    <h3 className="font-medium text-gray-800 mb-2">Payment Details</h3>
                    <div className="space-y-2">
                      {paymentDetails.reference && (
                        <div className="flex justify-between py-1 border-b border-gray-200">
                          <span className="text-gray-600">Reference:</span>
                          <span className="font-medium">{paymentDetails.reference}</span>
                        </div>
                      )}
                      {paymentDetails.amount && (
                        <div className="flex justify-between py-1 border-b border-gray-200">
                          <span className="text-gray-600">Amount:</span>
                          <span className="font-medium">₦{Number(paymentDetails.amount).toLocaleString()}</span>
                        </div>
                      )}
                      {paymentDetails.status && (
                        <div className="flex justify-between py-1 border-b border-gray-200">
                          <span className="text-gray-600">Status:</span>
                          <span className="font-medium capitalize">{paymentDetails.status}</span>
                        </div>
                      )}
                      {paymentDetails.payment_date && (
                        <div className="flex justify-between py-1">
                          <span className="text-gray-600">Date:</span>
                          <span className="font-medium">
                            {new Date(paymentDetails.payment_date).toLocaleString()}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                <button
                  type="button"
                  onClick={() => router.push("/users/make-search")}
                  className="bg-[#23A863] text-white px-6 py-2 rounded-full font-semibold hover:bg-[#1e9055] transition w-full mt-4"
                >
                  View Search Results
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex flex-col items-center justify-center py-4">
                  <XCircle className="h-16 w-16 text-red-500 mb-4" />
                  <p className="text-xl font-semibold text-red-500">Payment Verification Failed</p>
                  <p className="text-gray-600 mt-2">{error || "We couldn't verify your payment. Please try again."}</p>
                </div>
                
                <div className="flex flex-col space-y-3 mt-6">
                  <button
                    type="button"
                    onClick={() => router.push("/users/get-access")}
                    className="bg-[#23A863] text-white px-6 py-2 rounded-full font-semibold hover:bg-[#1e9055] transition"
                  >
                    Try Again
                  </button>
                  <button
                    type="button"
                    onClick={() => router.push("/users/dashboard")}
                    className="bg-gray-200 text-gray-800 px-6 py-2 rounded-full font-semibold hover:bg-gray-300 transition"
                  >
                    Back to Dashboard
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentVerificationPage;
