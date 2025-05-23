"use client";
import NormalUserLayout from "@/components/users/layout";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import UserTopbar from "@/components/users/dashboard/UserTopbar";
import UserSidebar from "@/components/users/User-Sidebar";
import { VerifyPayment } from "@/Services/AuthRequest/auth.request";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import axios from "axios";

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
        // Check for multiple possible reference parameter names (Paystack uses trxref or reference)
        let reference =
          searchParams.get("reference") || searchParams.get("trxref");

        // If we're coming from the Paystack redirect URL, it might have a different format
        if (!reference) {
          // Extract reference from the full URL if it contains 'payment-success' and a reference parameter
          const fullUrl = window.location.href;
          if (fullUrl.includes("payment-success")) {
            const urlObj = new URL(fullUrl);
            reference =
              urlObj.searchParams.get("reference") ||
              urlObj.searchParams.get("trxref");
            console.log("Extracted reference from full URL:", reference);
          }
        }

        // If still no reference, try to get it from session storage
        if (!reference) {
          // Try to get reference from session storage
          const paymentInfoStr = sessionStorage.getItem("paymentInfo");
          if (paymentInfoStr) {
            try {
              const paymentInfo = JSON.parse(paymentInfoStr);
              if (paymentInfo.reference) {
                reference = paymentInfo.reference;
                console.log("Using reference from payment info:", reference);
              } else if (paymentInfo.transaction_id) {
                reference = paymentInfo.transaction_id;
                console.log("Using transaction_id as reference:", reference);
              }
            } catch (error) {
              console.error("Error parsing payment info:", error);
            }
          }

          // Also try the dedicated reference storage
          if (!reference) {
            const storedReference = sessionStorage.getItem("paymentReference");
            if (storedReference) {
              reference = storedReference;
              console.log("Using stored payment reference:", reference);
            }
          }
        }

        if (!reference) {
          throw new Error("Payment reference not found");
        }

        console.log("Verifying payment with reference:", reference);

        // First try direct Paystack verification
        try {
          // If the reference appears to be a Paystack reference (typically starts with a specific format)
          if (
            reference.includes("Lis_Pendens") ||
            reference.includes("trxref")
          ) {
            console.log("Attempting direct Paystack verification first");
            await verifyPaystackTransaction(reference);
            return; // If successful, we're done
          }
        } catch (paystackError) {
          console.error(
            "Direct Paystack verification failed, falling back to regular verification:",
            paystackError
          );
          // Fall back to regular verification
        }

        // If direct verification failed or wasn't attempted, try regular verification
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
  const RETRY_DELAY = 6000; // 6 seconds

  // Function to directly verify a Paystack transaction
  const verifyPaystackTransaction = async (reference: string) => {
    try {
      console.log("Directly verifying Paystack transaction:", reference);

      // Get auth token from session storage
      let authToken = null;
      const authStr = sessionStorage.getItem("auth");
      if (authStr) {
        try {
          const auth = JSON.parse(authStr);
          authToken = auth.accessToken || auth.token;
        } catch (error) {
          console.error("Error parsing auth data:", error);
        }
      }

      if (!authToken) {
        throw new Error("Authentication token not found");
      }

      // Get the base URL from environment variable
      const baseURL = process.env.NEXT_PUBLIC_URL || "";

      // Make direct API call to verify the transaction
      const response = await axios.post(
        `${baseURL}/user/payment/verify`,
        { reference },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      console.log("Paystack verification response:", response.data);

      if (
        response.data &&
        (response.data.success === true || response.data.status === "success")
      ) {
        // Payment verified successfully
        setSuccess(true);
        setPaymentDetails(response.data.data || response.data);

        // Store the verified payment details
        sessionStorage.setItem(
          "verifiedPayment",
          JSON.stringify({
            reference,
            amount: response.data.data?.amount || 0,
            status: "verified",
            date: new Date().toISOString(),
            details: response.data.data || response.data,
          })
        );

        toast.success("Payment verified successfully");

        // Redirect to search results page after a delay
        setTimeout(() => {
          router.push("/users/user-search-result");
        }, 3000);

        return true;
      } else {
        // Payment verification failed
        throw new Error(
          response.data?.message || "Payment verification failed"
        );
      }
    } catch (error) {
      console.error("Error verifying Paystack transaction:", error);
      throw error;
    }
  };

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
        sessionStorage.setItem(
          "verifiedPayment",
          JSON.stringify({
            reference,
            amount: response.data?.amount || 0,
            status: "verified",
            date: new Date().toISOString(),
            details: response.data,
          })
        );

        toast.success("Payment verified successfully");

        // Redirect to search results page after a delay
        setTimeout(() => {
          router.push("/users/user-search-result");
        }, 3000);
      } else if (
        response.message?.includes("Awaiting Paygate confirmation") ||
        response.message?.includes("payment gateway") ||
        response.status === 500
      ) {
        // Payment is still being processed by the payment gateway
        // Retry after delay if we haven't exceeded max retries
        if (retryCount < MAX_RETRIES) {
          console.log(
            `Payment still processing. Retrying in ${
              RETRY_DELAY / 1000
            } seconds... (Attempt ${retryCount + 1}/${MAX_RETRIES})`
          );

          // Update UI to show we're waiting for confirmation
          setError(
            `Waiting for payment confirmation... (Attempt ${
              retryCount + 1
            }/${MAX_RETRIES})`
          );

          // Retry after delay
          setTimeout(() => {
            handleVerification(reference, retryCount + 1);
          }, RETRY_DELAY);
        } else {
          // Max retries exceeded
          setError(
            "Payment verification timed out. Please check your payment status later."
          );
          setVerifying(false);
        }
      } else {
        // Other error
        throw new Error(response.message || "Payment verification failed");
      }
    } catch (error: any) {
      console.error("Verification error:", error);

      // If it's a network error or 500 error, retry
      if (
        (error.message?.includes("network") ||
          error.response?.status === 500 ||
          error.message?.includes("timeout")) &&
        retryCount < MAX_RETRIES
      ) {
        console.log(
          `Network or server error. Retrying in ${
            RETRY_DELAY / 1000
          } seconds... (Attempt ${retryCount + 1}/${MAX_RETRIES})`
        );

        // Update UI to show we're retrying
        setError(
          `Connection error. Retrying... (Attempt ${
            retryCount + 1
          }/${MAX_RETRIES})`
        );

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
    <NormalUserLayout title="Payment Verification">
      <div className="flex h-screen">
        <div className="flex-1 flex flex-col">
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
                    <p className="text-xl font-semibold text-[#23A863]">
                      Payment Verified Successfully
                    </p>
                    <p className="text-gray-600 mt-2">
                      You will be redirected to your search results shortly...
                    </p>
                  </div>

                  {paymentDetails && (
                    <div className="bg-gray-50 rounded-lg p-4 text-left mt-6">
                      <h3 className="font-medium text-gray-800 mb-2">
                        Payment Details
                      </h3>
                      <div className="space-y-2">
                        {paymentDetails.reference && (
                          <div className="flex justify-between py-1 border-b border-gray-200">
                            <span className="text-gray-600">Reference:</span>
                            <span className="font-medium">
                              {paymentDetails.reference}
                            </span>
                          </div>
                        )}
                        {paymentDetails.amount && (
                          <div className="flex justify-between py-1 border-b border-gray-200">
                            <span className="text-gray-600">Amount:</span>
                            <span className="font-medium">
                              ₦{Number(paymentDetails.amount).toLocaleString()}
                            </span>
                          </div>
                        )}
                        {paymentDetails.status && (
                          <div className="flex justify-between py-1 border-b border-gray-200">
                            <span className="text-gray-600">Status:</span>
                            <span className="font-medium capitalize">
                              {paymentDetails.status}
                            </span>
                          </div>
                        )}
                        {paymentDetails.payment_date && (
                          <div className="flex justify-between py-1">
                            <span className="text-gray-600">Date:</span>
                            <span className="font-medium">
                              {new Date(
                                paymentDetails.payment_date
                              ).toLocaleString()}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => router.push("/users/user-search-result")}
                    className="bg-[#23A863] text-white px-6 py-2 rounded-full font-semibold hover:bg-[#1e9055] transition w-full mt-4"
                  >
                    View Search Results
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex flex-col items-center justify-center py-4">
                    <XCircle className="h-16 w-16 text-red-500 mb-4" />
                    <p className="text-xl font-semibold text-red-500">
                      Payment Verification Failed
                    </p>
                    <p className="text-gray-600 mt-2">
                      {error ||
                        "We couldn't verify your payment. Please try again."}
                    </p>
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
    </NormalUserLayout>
  );
};

export default PaymentVerificationPage;
