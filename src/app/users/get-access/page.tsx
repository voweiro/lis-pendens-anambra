"use client";
import NormalUserLayout from "@/components/users/layout";
import React, { useState, useEffect } from "react";
import UserTopbar from "@/components/users/dashboard/UserTopbar";
import UserSidebar from "@/components/users/User-Sidebar";
import axios from "axios";
import { useRouter } from "next/navigation";

const PAYMENT_AMOUNT = 5000; // Default payment amount for property search
const CURRENCY = "NGN";

// Available payment methods
const PAYMENT_METHODS = {
  PAYSTACK: "paystack",
  NORLICS: "norlics",
};

const UserGetAccessPage = () => {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [redirecting, setRedirecting] = useState(false);
  const [searchId, setSearchId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState(PAYMENT_METHODS.PAYSTACK);

  // Load user data from session storage
  useEffect(() => {
    // Try to get user info and payment info from session storage
    let userName = "";
    let userEmail = "";
    let searchIdValue = null;

    // First try to get the search ID directly from storage
    const directSearchId = sessionStorage.getItem("currentSearchId");
    if (directSearchId) {
      console.log("Found search ID directly in storage:", directSearchId);
      searchIdValue = directSearchId;
      setSearchId(directSearchId);
    } else {
      // If not found directly, try to extract from search results
      const searchResultsStr = sessionStorage.getItem("searchResults");
      if (searchResultsStr) {
        try {
          const searchResults = JSON.parse(searchResultsStr);
          if (searchResults && searchResults.length > 0) {
            searchIdValue = searchResults[0].id || searchResults[0]._id;
            if (searchIdValue) {
              console.log("Extracted search ID from results:", searchIdValue);
              setSearchId(searchIdValue);
              // Store it for future use
              sessionStorage.setItem("currentSearchId", searchIdValue);
            }
          }
        } catch (error) {
          console.error("Error parsing search results:", error);
        }
      }
    }

    // If still not found, check the pending search params
    if (!searchIdValue) {
      const pendingSearchParamsStr = sessionStorage.getItem(
        "pendingSearchParams"
      );
      if (pendingSearchParamsStr) {
        try {
          const pendingParams = JSON.parse(pendingSearchParamsStr);
          if (pendingParams.search_id) {
            console.log(
              "Found search ID in pending params:",
              pendingParams.search_id
            );
            searchIdValue = pendingParams.search_id;
            setSearchId(searchIdValue);
            // Store it for future use
            sessionStorage.setItem("currentSearchId", searchIdValue);
          }
        } catch (error) {
          console.error("Error parsing pending search params:", error);
        }
      }
    }

    // Load Flutterwave script with proper error handling
    const loadFlutterwaveScript = () => {
      if (!document.getElementById("flutterwave-script")) {
        const script = document.createElement("script");
        script.id = "flutterwave-script";
        script.src = "https://checkout.flutterwave.com/v3.js";
        script.async = true;
        script.crossOrigin = "anonymous";

        // Add event listeners to handle script loading
        script.onload = () => {
          console.log("Flutterwave script loaded successfully");
        };

        script.onerror = (error) => {
          console.error("Error loading Flutterwave script:", error);
          setError(
            "Payment system failed to load. Please refresh the page and try again."
          );
        };

        document.body.appendChild(script);
      }
    };

    loadFlutterwaveScript();

    // Try to get user info from payment info
    const paymentInfoStr = sessionStorage.getItem("paymentInfo");
    if (paymentInfoStr) {
      try {
        const paymentInfo = JSON.parse(paymentInfoStr);
        userName = paymentInfo.userName || "";
        userEmail = paymentInfo.userEmail || "";
      } catch (error) {
        console.error("Error parsing payment info:", error);
      }
    }

    // If not found in payment info, try user object
    if (!userName || !userEmail) {
      const userStr = sessionStorage.getItem("user");
      if (userStr) {
        try {
          const userData = JSON.parse(userStr);
          userName = userData.name || userData.fullName || "";
          userEmail = userData.email || "";
        } catch (error) {
          console.error("Error parsing user data:", error);
        }
      }
    }

    // If still not found, try auth object
    if (!userName || !userEmail) {
      const authStr = sessionStorage.getItem("auth");
      if (authStr) {
        try {
          const auth = JSON.parse(authStr);

          if (auth.data && auth.data.user) {
            userName = auth.data.user.name || auth.data.user.fullName || "";
            userEmail = auth.data.user.email || "";
          } else if (auth.user) {
            userName = auth.user.name || auth.user.fullName || "";
            userEmail = auth.user.email || "";
          }
        } catch (error) {
          console.error("Error parsing auth data:", error);
        }
      }
    }

    // Update form with user data
    setForm({
      name: userName,
      email: userEmail,
    });

    setIsLoading(false);
  }, []);

  // Function to verify payment status using the reference
  const verifyPayment = async (reference: string) => {
    try {
      // Validate that reference is not empty
      if (!reference || reference.trim() === "") {
        throw new Error("Payment reference is missing or invalid");
      }

      setRedirecting(true);

      // Get auth token
      let authToken = sessionStorage.getItem("token");
      if (!authToken) {
        const authStr = sessionStorage.getItem("auth");
        if (authStr) {
          try {
            const auth = JSON.parse(authStr);
            authToken =
              auth.accessToken || (auth.data && auth.data.token) || auth.token;
          } catch (error) {
            console.error("Error parsing auth data:", error);
            throw new Error(
              "Authentication token not found. Please log in again."
            );
          }
        }
      }

      if (!authToken) {
        throw new Error("Authentication token not found. Please log in again.");
      }

      // Get the base URL from environment variable
      const baseURL = process.env.NEXT_PUBLIC_URL || "";

      console.log("Verifying payment with reference:", reference);

      // Ensure we have a valid reference - use hardcoded value for testing if needed
      const validReference = reference || "norlics_681eae0295243";
      console.log("Using reference for verification:", validReference);

      // Create the request payload with the reference field
      const verifyPayload = {
        reference: validReference,
      };

      console.log(
        "Sending verification payload:",
        JSON.stringify(verifyPayload)
      );

      // Make the API call to verify payment
      const response = await axios.post(
        `${baseURL}/user/payment/verify`,
        verifyPayload,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          timeout: 10000, // 10 second timeout
        }
      );

      console.log("Payment verification response:", response.data);

      if (response.data && response.data.success === true) {
        // Update payment status in session storage
        const paymentInfoStr = sessionStorage.getItem("paymentInfo");
        if (paymentInfoStr) {
          try {
            const paymentInfo = JSON.parse(paymentInfoStr);
            paymentInfo.payment_status = "completed";
            paymentInfo.verified = true;
            sessionStorage.setItem("paymentInfo", JSON.stringify(paymentInfo));
          } catch (error) {
            console.error("Error updating payment info:", error);
          }
        }

        // Redirect to success page or search results
        setTimeout(() => {
          router.push("/users/search-results");
        }, 1000);

        return true;
      } else {
        throw new Error(
          response.data?.message || "Payment verification failed"
        );
      }
    } catch (error: any) {
      console.error("Payment verification error:", error);
      setError(
        error.message || "Payment verification failed. Please try again."
      );
      setRedirecting(false);
      setLoading(false);
      return false;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Get the user ID from session storage
      const userId = sessionStorage.getItem("user_id");
      if (!userId) {
        throw new Error("User ID not found. Please log in again.");
      }

      // Get the search ID from search results or search params
      let searchIdValue = searchId;
      if (!searchIdValue) {
        const searchResultsStr = sessionStorage.getItem("searchResults");
        if (searchResultsStr) {
          try {
            const searchResults = JSON.parse(searchResultsStr);
            if (searchResults && searchResults.length > 0) {
              searchIdValue = searchResults[0].id || searchResults[0]._id;
            }
          } catch (error) {
            console.error("Error parsing search results:", error);
          }
        }
      }

      // Get the currentSearchId from session storage as a fallback
      if (!searchIdValue) {
        const directSearchId = sessionStorage.getItem("currentSearchId");
        if (directSearchId) {
          console.log("Using search ID from session storage:", directSearchId);
          searchIdValue = directSearchId;
          setSearchId(directSearchId);
        }
      }

      // Log the search ID for debugging
      console.log("Final search ID for payment:", searchIdValue);

      // Get auth token from session storage
      let authToken = sessionStorage.getItem("token");
      if (!authToken) {
        const authStr = sessionStorage.getItem("auth");
        if (authStr) {
          try {
            const auth = JSON.parse(authStr);
            authToken =
              auth.accessToken || (auth.data && auth.data.token) || auth.token;
          } catch (error) {
            console.error("Error parsing auth data:", error);
          }
        }
      }

      if (!authToken) {
        throw new Error("Authentication token not found. Please log in again.");
      }

      // Get the base URL from environment variable
      const baseURL = process.env.NEXT_PUBLIC_URL || "";

      // Create JSON data for the API request - sending payment_method and case_ids
      // Get case_ids from session storage
      let caseIds: (string | number)[] = [];
      const caseIdsStr = sessionStorage.getItem("case_ids");
      if (caseIdsStr) {
        try {
          caseIds = JSON.parse(caseIdsStr);
          console.log("Retrieved case_ids from session storage:", caseIds);
        } catch (error) {
          console.error("Error parsing case_ids:", error);
        }
      }

      // If no case_ids found but we have a search_id, use it directly
      if (caseIds.length === 0 && searchIdValue) {
        caseIds.push(searchIdValue);
        console.log(
          "No case_ids found, using search_id as a case_id:",
          searchIdValue
        );
      }

      // Convert the case_id array to a comma-separated string
      const caseIdString = caseIds.join(",");
      console.log("Converted case_id array to string:", caseIdString);

      // Get the base URL for the callback
      const origin =
        typeof window !== "undefined" ? window.location.origin : "";
      const callbackUrl = `${origin}/users/verify-payment`;

      // Always use case_id in the payment data as a string and include callback URL
      const paymentData = {
        payment_method: paymentMethod,
        case_id: caseIdString,
        callback_url: callbackUrl,
        return_url: callbackUrl,
      };

      console.log("Initiating payment with data:", paymentData);

      try {
        // Make the API call to initiate payment
        const response = await axios.post(
          `${baseURL}/user/payment/initiate`,
          paymentData,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            timeout: 10000, // 10 second timeout
          }
        );

        console.log("Payment initiation response:", response.data);

        if (response.data && response.data.success === true) {
          // Extract the reference from the response
          const paymentReference =
            response.data.reference ||
            response.data.data?.reference ||
            response.data.data?.transaction_id;
          console.log("Extracted payment reference:", paymentReference);

          // Store the payment information for reference
          const paymentInfo = {
            payment_amount: PAYMENT_AMOUNT,
            payment_date: new Date().toISOString(),
            payment_status: "pending",
            case_id: caseIdString,
            reference: paymentReference || `DIRECT-${Date.now()}`,
          };

          // Store payment info in session storage
          sessionStorage.setItem("paymentInfo", JSON.stringify(paymentInfo));

          // Store the reference separately for easier access
          if (paymentReference) {
            sessionStorage.setItem("paymentReference", paymentReference);
          }

          // Check for checkout URL in different possible locations in the response
          let checkoutUrl = "";

          if (response.data.data && response.data.data.checkout_url) {
            checkoutUrl = response.data.data.checkout_url;
          } else if (response.data.data && response.data.data.url) {
            checkoutUrl = response.data.data.url;
          } else if (response.data.checkout_url) {
            checkoutUrl = response.data.checkout_url;
          } else if (response.data.url) {
            checkoutUrl = response.data.url;
          }

          if (checkoutUrl) {
            // Show redirecting state
            setRedirecting(true);
            console.log("Redirecting to payment URL:", checkoutUrl);

            // Add a small delay before redirecting to show the user we're processing
            setTimeout(() => {
              // Redirect to the payment gateway
              window.location.href = checkoutUrl;
            }, 1000);
          } else {
            // Navigate to the verify payment page with the reference if no checkout URL
            if (paymentReference) {
              console.log(
                "Navigating to verify payment page with reference:",
                paymentReference
              );
              router.push(
                `/users/verify-payment?reference=${paymentReference}`
              );
            } else {
              throw new Error("Payment reference not found in response");
            }
          }
        } else {
          throw new Error(
            response.data?.message || "Payment initiation failed"
          );
        }
      } catch (apiError: any) {
        console.error("API Error:", apiError);

        // Handle specific error cases
        if (apiError.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.error("Error response:", apiError.response.data);
          console.error("Error status:", apiError.response.status);

          if (apiError.response.status === 500) {
            throw new Error(
              "Server error. Please try again later or contact support."
            );
          } else if (apiError.response.data && apiError.response.data.message) {
            throw new Error(apiError.response.data.message);
          }
        } else if (apiError.request) {
          // The request was made but no response was received
          throw new Error(
            "No response from server. Please check your internet connection."
          );
        }

        // Re-throw the error to be caught by the outer catch block
        throw apiError;
      }

      // This section is now handled in the try-catch block above
    } catch (err: any) {
      console.error("Payment error:", err);
      setError(
        err.message || "Payment initialization failed. Please try again."
      );
      setRedirecting(false);
    } finally {
      setLoading(false);
    }
  };

  // Automatically initiate payment when component loads and user data is ready
  useEffect(() => {
    if (!isLoading && form.name && form.email && searchId) {
      // Auto-submit payment after a short delay
      const timer = setTimeout(() => {
        handlePaymentProcess();
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [isLoading, form, searchId, router]);

  // Function to handle payment without form submission
  const handlePaymentProcess = () => {
    if (loading) return; // Prevent multiple submissions

    // Create a synthetic event to pass to handleSubmit
    const syntheticEvent = {
      preventDefault: () => {},
    } as React.FormEvent;

    handleSubmit(syntheticEvent);
  };

  return (
    <NormalUserLayout title="Get Access">
      <div className="flex h-screen">
        <div className="flex-1 flex flex-col">
          <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white shadow-lg rounded-xl p-8 max-w-md w-full text-center text-black">
              <h1 className="text-2xl font-bold mb-4">Payment Processing</h1>

              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mb-4"></div>
                  <p className="text-gray-700">Loading your information...</p>
                </div>
              ) : redirecting ? (
                <div className="mb-4 text-green-600 font-semibold animate-pulse py-8">
                  Payment successful! Redirecting to your search receipt...
                </div>
              ) : (
                <div className="space-y-6">
                  <p className="mb-6 text-gray-700">
                    We're preparing your payment using your account information.
                  </p>

                  <div className="bg-gray-50 rounded-lg p-4 text-left">
                    <div className="flex justify-between py-2 border-b border-gray-200">
                      <span className="text-gray-600">Name:</span>
                      <span className="font-medium">{form.name}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-200">
                      <span className="text-gray-600">Email:</span>
                      <span className="font-medium">{form.email}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-200">
                      <span className="text-gray-600">Amount:</span>
                      <span className="font-medium">
                        ₦{PAYMENT_AMOUNT.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="text-gray-600">Payment Method:</span>
                      <span className="font-medium">
                        {paymentMethod === PAYMENT_METHODS.PAYSTACK
                          ? "Paystack"
                          : "Norics"}
                      </span>
                    </div>
                  </div>

                  {/* Payment Method Selection */}
                  <div className="mt-4 mb-4">
                    <div className="flex flex-col space-y-2">
                      <label className="text-left text-sm font-medium text-gray-700">
                        Select Payment Method:
                      </label>
                      <div className="flex space-x-4">
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="radio"
                            name="paymentMethod"
                            checked={paymentMethod === PAYMENT_METHODS.PAYSTACK}
                            onChange={() =>
                              setPaymentMethod(PAYMENT_METHODS.PAYSTACK)
                            }
                            className="h-4 w-4 text-green-600 focus:ring-green-500"
                          />
                          <span>Paystack</span>
                        </label>
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="radio"
                            name="paymentMethod"
                            checked={paymentMethod === PAYMENT_METHODS.NORLICS}
                            onChange={() =>
                              setPaymentMethod(PAYMENT_METHODS.NORLICS)
                            }
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                          />
                          <span>Norics</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  {error && (
                    <div className="text-red-500 text-sm mt-4">{error}</div>
                  )}

                  <button
                    type="button"
                    onClick={handlePaymentProcess}
                    className="bg-black text-white px-6 py-2 rounded-full font-semibold hover:bg-gray-800 transition w-full"
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Processing...
                      </div>
                    ) : (
                      `Pay with ${
                        paymentMethod === PAYMENT_METHODS.PAYSTACK
                          ? "Paystack"
                          : "Norics"
                      }`
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </NormalUserLayout>
  );
};

export default UserGetAccessPage;
