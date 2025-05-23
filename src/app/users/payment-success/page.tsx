"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, CheckCircle } from "lucide-react";

const PaymentSuccessPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [message, setMessage] = useState("Processing your payment...");
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    // Extract the reference from URL parameters
    // Paystack uses either 'reference' or 'trxref' as parameter names
    const reference = searchParams.get("reference") || searchParams.get("trxref");
    
    if (reference) {
      console.log('Payment reference found:', reference);
      
      // Store the reference in session storage for later use
      sessionStorage.setItem("paymentReference", reference);
      
      // Update payment info in session storage to mark as completed
      const paymentInfoStr = sessionStorage.getItem("paymentInfo");
      if (paymentInfoStr) {
        try {
          const paymentInfo = JSON.parse(paymentInfoStr);
          paymentInfo.payment_status = "completed";
          paymentInfo.reference = reference;
          paymentInfo.completed_at = new Date().toISOString();
          sessionStorage.setItem("paymentInfo", JSON.stringify(paymentInfo));
        } catch (error) {
          console.error('Error updating payment info:', error);
        }
      }
      
      setMessage("Payment successful! Redirecting to verification page...");
      
      // Start countdown for redirect
      const countdownInterval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(countdownInterval);
            // Redirect to verify-payment page with the reference
            router.push(`/users/verify-payment?reference=${reference}`);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      return () => clearInterval(countdownInterval);
    } else {
      console.error('No payment reference found in URL parameters');
      setMessage("Payment reference not found. Redirecting to verification page...");
      
      // Try to get reference from session storage as fallback
      const storedReference = sessionStorage.getItem("paymentReference");
      if (storedReference) {
        console.log('Using stored reference:', storedReference);
        router.push(`/users/verify-payment?reference=${storedReference}`);
        return;
      }
      
      // Start countdown for redirect without reference
      const countdownInterval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(countdownInterval);
            // If no reference is found, redirect to verify-payment page anyway
            // The verify-payment page will try to find the reference from other sources
            router.push('/users/verify-payment');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      return () => clearInterval(countdownInterval);
    }
  }, [router, searchParams]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="backdrop-blur-sm bg-white/30 shadow-lg rounded-xl p-8 max-w-md w-full text-center">
        <div className="flex flex-col items-center justify-center py-8">
          {countdown > 0 ? (
            <Loader2 className="h-12 w-12 text-green-500 animate-spin mb-4" />
          ) : (
            <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
          )}
          <h1 className="text-2xl font-bold mb-4">Payment Successful!</h1>
          <p className="text-gray-600 mb-2">{message}</p>
          <p className="text-gray-500">Redirecting in {countdown} seconds...</p>
          
          {/* Manual redirect button as backup */}
          <button
            onClick={() => {
              const reference = searchParams.get("reference") || searchParams.get("trxref");
              if (reference) {
                router.push(`/users/verify-payment?reference=${reference}`);
              } else {
                router.push('/users/verify-payment');
              }
            }}
            className="mt-4 bg-green-500 text-white px-6 py-2 rounded-full font-semibold hover:bg-green-600 transition"
          >
            Continue to Verification
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;