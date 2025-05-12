"use client";

import React, { useState, useEffect } from "react";
import UserTopbar from "@/components/users/dashboard/UserTopbar";
import UserSidebar from "@/components/users/User-Sidebar";

const FLUTTERWAVE_PUBLIC_KEY = "FLWPUBK_TEST-3b48e543af90cfc1a33822d02376a17b-X"; 
const PAYMENT_AMOUNT = 2000; 
const CURRENCY = "NGN";

const UserGetAccessPage = () => {
  const [form, setForm] = useState({ name: "", email: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [redirecting, setRedirecting] = useState(false);

  // Dynamically load the Flutterwave inline script
  useEffect(() => {
    if (!document.getElementById("flutterwave-script")) {
      const script = document.createElement("script");
      script.id = "flutterwave-script";
      script.src = "https://checkout.flutterwave.com/v3.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      // Check if FlutterwaveCheckout is available
      // @ts-ignore
      if (window.FlutterwaveCheckout) {
        // @ts-ignore
        window.FlutterwaveCheckout({
          public_key: FLUTTERWAVE_PUBLIC_KEY,
          tx_ref: `LES-${Date.now()}`,
          amount: PAYMENT_AMOUNT,
          currency: CURRENCY,
          payment_options: "card,banktransfer,ussd",
          customer: {
            email: form.email,
            name: form.name,
          },
          customizations: {
            title: "LES Property Search Payment",
            description: "Payment for property search access",
            logo: "/favicon.ico",
          },
          callback: async function (data: any) {
            // Handle payment callback here
            console.log("Flutterwave payment callback:", data);
            if (data.status === "successful" || data.status === "completed") {
              try {
                // Get the pendens_ids from sessionStorage
                const pendingSearchParamsStr = sessionStorage.getItem("pendingSearchParams");
                console.log('Raw pendingSearchParams:', pendingSearchParamsStr);
                
                if (!pendingSearchParamsStr) {
                  console.error('No search parameters found in session storage');
                  throw new Error('Search parameters not found. Please try searching again.');
                }
                
                const searchParams = JSON.parse(pendingSearchParamsStr);
                console.log('Parsed searchParams:', searchParams);
                
                // Get the pendens_id string that we formatted during search
                // This should be a comma-separated string of the IDs from the API
                const pendensIdValue = searchParams.pendens_id;
                
                // Add detailed debugging
                console.log('DETAILED DEBUG - searchParams object:', searchParams);
                console.log('DETAILED DEBUG - pendensIdValue type:', typeof pendensIdValue);
                console.log('DETAILED DEBUG - pendensIdValue:', pendensIdValue);
                
                // Force the value to be a string if it's not already
                const pendensIdString = Array.isArray(searchParams.pendens_ids) 
                  ? searchParams.pendens_ids.join(',') 
                  : String(pendensIdValue || '');
                  
                console.log('DETAILED DEBUG - Using formatted pendensIdString:', pendensIdString);
                
                // Use the formatted string, or fall back to the original value if needed
                if (!pendensIdString && !pendensIdValue) {
                  console.error('No pendens_id found in search parameters');
                  throw new Error('Search result IDs not found. Please try searching again.');
                }

                setRedirecting(true);
                
                // Get the actual user ID from session storage
                const userId = sessionStorage.getItem('user_id');
                console.log('Using user ID from session storage:', userId);
                
                if (!userId) {
                  console.error('No user ID found in session storage');
                  throw new Error('User ID not found. Please log in again.');
                }
                
                // Dynamically import updatePayment to avoid SSR issues
                const { updatePayment } = await import("@/components/utils/api");
                const paymentResponse = await updatePayment({
                  user_id: userId, // Use the actual user ID from session storage
                  payment_amount: PAYMENT_AMOUNT,
                  payment_session_id: data.tx_ref || "session_id_placeholder",
                  pendens_id: pendensIdString || pendensIdValue // Use the formatted string
                });
                
                console.log('Payment update API response:', paymentResponse);
                
                // Extract the payment_id from the response if available
                const backendPaymentId = paymentResponse?.payment_id || paymentResponse?.id;
                console.log('Backend payment_id:', backendPaymentId);

                // Store the payment information for reference, including the payment_id from backend
                sessionStorage.setItem("paymentInfo", JSON.stringify({
                  payment_amount: PAYMENT_AMOUNT,
                  payment_session_id: data.tx_ref || "session_id_placeholder",
                  payment_date: new Date().toISOString(),
                  payment_status: "successful",
                  pendens_ids: pendensIdValue, // Store the pendens_id for later use
                  payment_id: backendPaymentId // Store the payment_id from the backend
                }));
                setTimeout(() => {
                  window.location.href = "/users/make-search";
                }, 1500);
              } catch (err) {
                console.error("Update payment error:", err);
                setError("Payment succeeded but failed to update backend. Please contact support.");
                setRedirecting(false);
              }
            }
          },
          onclose: function() {
            setLoading(false);
          },
        });
      } else {
        setError("Payment system not loaded. Please try again in a moment.");
      }
    } catch (err) {
      setError("Payment initialization failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen">
      <UserSidebar />
      <div className="flex-1 flex flex-col">
        <UserTopbar title="Get Access" />
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
          <div className="bg-white shadow-lg rounded-xl p-8 max-w-md w-full text-center text-black">
            <h1 className="text-2xl font-bold mb-4">Get Access</h1>
            <p className="mb-6 text-gray-700">
              To proceed, enter your details to continue to payment.
            </p>
            {redirecting && (
              <div className="mb-4 text-green-600 font-semibold animate-pulse">Payment successful! Redirecting to your search receipt...</div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4 text-left">
              <div>
                <label className="block mb-1 font-medium">Name</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring"
                  placeholder="Enter your name"
                  required
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Email</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring"
                  placeholder="Enter your email"
                  required
                />
              </div>
              {error && <div className="text-red-500 text-sm">{error}</div>}
              <button
                type="submit"
                className="bg-black text-white px-6 py-2 rounded-full font-semibold hover:bg-gray-800 transition w-full"
                disabled={loading}
              >
                {loading ? "Processing..." : "Proceed to Payment"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserGetAccessPage;
