"use client";

import type React from "react";

import { useState, useEffect } from "react";
import type {
  FieldErrors,
  UseFormRegister,
  UseFormWatch,
} from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { Search, MapPin, FileText, User, X, Loader2 } from "lucide-react";
import {
  SearchRequest,
  GetStates,
  GetLGAs,
} from "@/Services/AuthRequest/auth.request";

interface SearchFormProps {
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
  watch: UseFormWatch<any>;
  isSearching: boolean;
  onClose: () => void;
}

interface State {
  id: string;
  label: string;
  active: boolean;
  url?: string;
}

interface LGA {
  id: string;
  label: string;
  active: boolean;
  url?: string;
}

const UsersSearchForm: React.FC<SearchFormProps> = ({
  register,
  errors,
  watch,
  isSearching,
  onClose,
}) => {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState<
    "property" | "location" | "owner"
  >("property");
  const [states, setStates] = useState<State[]>([]);
  const [lgas, setLgas] = useState<LGA[]>([]);
  const [loadingStates, setLoadingStates] = useState(false);
  const [loadingLgas, setLoadingLgas] = useState(false);
  const [stateError, setStateError] = useState<string | null>(null);
  const [lgaError, setLgaError] = useState<string | null>(null);

  // Fetch states when component mounts
  useEffect(() => {
    const fetchStates = async () => {
      setLoadingStates(true);
      setStateError(null);
      try {
        const response = await GetStates();
        if (response && Array.isArray(response)) {
          setStates(response);
        } else if (response && response.data && Array.isArray(response.data)) {
          setStates(response.data);
        } else {
          console.error("Unexpected states response format:", response);
          setStateError("Failed to load states. Please try again.");
        }
      } catch (error) {
        console.error("Error fetching states:", error);
        setStateError("Failed to load states. Please try again.");
      } finally {
        setLoadingStates(false);
      }
    };

    fetchStates();
  }, []);

  // Fetch LGAs when state changes
  const selectedState = watch("state");

  useEffect(() => {
    if (!selectedState) {
      setLgas([]);
      return;
    }

    const fetchLgas = async () => {
      setLoadingLgas(true);
      setLgaError(null);
      try {
        const response = await GetLGAs(selectedState);
        if (response && Array.isArray(response)) {
          setLgas(response);
        } else if (response && response.data && Array.isArray(response.data)) {
          setLgas(response.data);
        } else {
          console.error("Unexpected LGAs response format:", response);
          setLgaError("Failed to load local governments. Please try again.");
        }
      } catch (error) {
        console.error("Error fetching LGAs:", error);
        setLgaError("Failed to load local governments. Please try again.");
      } finally {
        setLoadingLgas(false);
      }
    };

    fetchLgas();
  }, [selectedState]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      // Find the selected state and LGA objects from our arrays
      const stateId = (e.target as any).state.value;
      const lgaId = (e.target as any).lga.value;

      if (!stateId || !lgaId) {
        toast.error("Please select both State and LGA");
        return;
      }

      // Find the state and LGA labels for display purposes
      const selectedState = states.find((state) => state.id === stateId);
      const selectedLGA = lgas.find((lga) => lga.id === lgaId);

      console.log("Selected state:", selectedState);
      console.log("Selected LGA:", selectedLGA);

      // Extract form data with the required parameters for the new endpoint
      const formData = {
        // Required parameters for the new endpoint
        lga_id: lgaId,
        state_id: stateId,
        payment_method: "paystack", // Using paystack as the payment method

        // Additional parameters for search context
        title_type: (e.target as any).propertyTitle.value,
        lga: selectedLGA?.label || lgaId, // Use label for display, fallback to ID
        state: selectedState?.label || stateId, // Use label for display, fallback to ID
        register_title: (e.target as any).registerTitle.value,
        plot_number: (e.target as any).plotNumber.value,
        plot_street_name: (e.target as any).plotStreetName.value,
        city: (e.target as any).city.value,
        survey_plan_number: (e.target as any).surveyPlanNumber.value,
        property_owner: (e.target as any).propertyOwner.value,
      };

      try {
        // Call the SearchRequest function from auth.request.ts
        const result = await SearchRequest(formData);

        if (!result) {
          throw new Error("No response from search API");
        }

        console.log("Search response:", result);

        // Check if the response contains a Paystack payment URL
        if (
          result.success === true &&
          result.message?.includes("Paystack payment initiated")
        ) {
          // Store search parameters and reference for later use
          sessionStorage.setItem(
            "pendingSearchParams",
            JSON.stringify(formData)
          );

          if (result.data?.reference) {
            sessionStorage.setItem("paymentReference", result.data.reference);
          }

          // Show message before redirect
          toast.info("Redirecting to payment gateway...");

          // If we have a payment URL, redirect the user to it
          if (result.data?.url) {
            console.log("Redirecting to payment URL:", result.data.url);

            // Store the current search state so we can restore it after payment
            const searchState = {
              formData,
              paymentReference: result.data.reference,
              timestamp: new Date().toISOString(),
            };
            sessionStorage.setItem(
              "currentSearchState",
              JSON.stringify(searchState)
            );

            // Redirect to the payment URL
            window.location.href = result.data.url;
            return;
          }
        }

        // Process the search results if not redirected to payment
        let searchId = null;

        // Extract search_id from the response if available
        if (result.data?.search_id) {
          searchId = result.data.search_id;
        } else if (result.search_id) {
          searchId = result.search_id;
        } else if (result.data?.id) {
          searchId = result.data.id;
        } else if (result.id) {
          searchId = result.id;
        } else if (result.data?.reference) {
          // Use payment reference as a fallback ID
          searchId = result.data.reference;
        }

        // Store the search ID for later use
        if (searchId) {
          console.log("Storing search ID in session storage:", searchId);
          sessionStorage.setItem("currentSearchId", searchId);
        }

        // Format and store search results
        const formattedResults = [
          {
            id: searchId || "pending",
            title: formData.title_type || "Property Title",
            owner: formData.property_owner || "Property Owner",
            summary: `${formData.lga}, ${formData.state}`,
            details: result.data || result,
            reference: result.data?.reference,
          },
        ];

        sessionStorage.setItem(
          "searchResults",
          JSON.stringify(formattedResults)
        );

        // Store the search parameters
        sessionStorage.setItem("pendingSearchParams", JSON.stringify(formData));

        // Get user information for payment
        let userName = "";
        let userEmail = "";

        // Try to get user info from session storage
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

        // If user info not found in 'user', try auth object
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

        // Store payment info
        const paymentInfo = {
          userName,
          userEmail,
          searchId,
          reference: result.data?.reference,
          amount: 5000, // Default amount
          description: `Property Search - ${formData.lga}, ${formData.state}`,
        };

        sessionStorage.setItem("paymentInfo", JSON.stringify(paymentInfo));

        // Show success message
        toast.success("Search initiated successfully");

        // If we didn't redirect to payment URL, go to verify payment page
        router.push("/users/verify-payment");
      } catch (searchError: any) {
        console.error("Search API error:", searchError);

        // Show detailed error message
        const errorMessage =
          searchError?.response?.data?.message ||
          searchError?.message ||
          "Search failed. Please try again.";
        toast.error(errorMessage);

        // Store the form data so we can try again
        sessionStorage.setItem("pendingSearchParams", JSON.stringify(formData));
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      toast.error("An unexpected error occurred. Please try again later.");
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-xl overflow-hidden max-w-3xl mx-auto">
      {/* Header */}
      <div className="bg-[#23A863] px-4 sm:px-6 py-4 flex items-center justify-between">
        <h2 className="text-white text-lg font-semibold">Property Search</h2>
        <button
          type="button"
          onClick={onClose}
          className="text-white hover:bg-white/20 rounded-full p-1 transition-colors"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          type="button"
          onClick={() => setActiveSection("property")}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
            activeSection === "property"
              ? "border-b-2 border-[#23A863] text-[#23A863]"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <FileText className="h-4 w-4" />
          <span className="hidden sm:inline">Property Details</span>
          <span className="sm:hidden">Details</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveSection("location")}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
            activeSection === "location"
              ? "border-b-2 border-[#23A863] text-[#23A863]"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <MapPin className="h-4 w-4" />
          <span>Location</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveSection("owner")}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
            activeSection === "owner"
              ? "border-b-2 border-[#23A863] text-[#23A863]"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <User className="h-4 w-4" />
          <span>Owner</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="px-4 sm:px-6 py-6">
        {/* Property Details Section */}
        <div className={activeSection === "property" ? "block" : "hidden"}>
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="propertyTitle"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Property Title
                </label>
                <input
                  id="propertyTitle"
                  type="text"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#23A863] focus:border-transparent"
                  placeholder="Certificate of occupancy"
                  {...register("propertyTitle")}
                />
                {errors.propertyTitle && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.propertyTitle.message as string}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="registerTitle"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Registered Title Number
                </label>
                <input
                  id="registerTitle"
                  type="text"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#23A863] focus:border-transparent"
                  placeholder="e.g. LP24452168PD"
                  {...register("registerTitle")}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="surveyPlanNumber"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Survey Plan Number
              </label>
              <input
                id="surveyPlanNumber"
                type="text"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#23A863] focus:border-transparent"
                placeholder="Enter survey plan number"
                {...register("surveyPlanNumber")}
              />
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="button"
                onClick={() => setActiveSection("location")}
                className="bg-[#23A863] text-white px-4 py-2 rounded-lg hover:bg-[#1e8f53] transition-colors"
              >
                Next: Location
              </button>
            </div>
          </div>
        </div>

        {/* Location Section */}
        <div className={activeSection === "location" ? "block" : "hidden"}>
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="plotNumber"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Plot Number
                </label>
                <input
                  id="plotNumber"
                  type="text"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#23A863] focus:border-transparent"
                  placeholder="e.g. Plot 123"
                  {...register("plotNumber")}
                />
              </div>
              <div>
                <label
                  htmlFor="plotStreetName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Street Name
                </label>
                <input
                  id="plotStreetName"
                  type="text"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#23A863] focus:border-transparent"
                  placeholder="e.g. Lamido Crescent"
                  {...register("plotStreetName")}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="city"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  City/Town
                </label>
                <input
                  id="city"
                  type="text"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#23A863] focus:border-transparent"
                  placeholder="e.g. Abuja"
                  {...register("city")}
                />
              </div>
              <div>
                <label
                  htmlFor="state"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  State
                </label>
                <div className="relative">
                  <select
                    id="state"
                    {...register("state", { required: "State is required" })}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#23A863] focus:border-transparent"
                    disabled={loadingStates}
                  >
                    <option value="">Select State</option>
                    {states.map((state) => (
                      <option key={state.id} value={state.id}>
                        {state.label}
                      </option>
                    ))}
                  </select>
                  {loadingStates && (
                    <div className="absolute right-2 top-2">
                      <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
                    </div>
                  )}
                </div>
                {stateError && (
                  <p className="text-red-500 text-xs mt-1">{stateError}</p>
                )}
                {errors.state && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.state.message as string}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor="lga"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Local Government Area (LGA)
              </label>
              <div className="relative">
                <select
                  id="lga"
                  {...register("lga", { required: "LGA is required" })}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#23A863] focus:border-transparent"
                  disabled={loadingLgas || !selectedState}
                >
                  <option value="">
                    {selectedState
                      ? "Select LGA"
                      : "Please select a state first"}
                  </option>
                  {lgas.map((lga) => (
                    <option key={lga.id} value={lga.id}>
                      {lga.label}
                    </option>
                  ))}
                </select>
                {loadingLgas && (
                  <div className="absolute right-2 top-2">
                    <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
                  </div>
                )}
              </div>
              {lgaError && (
                <p className="text-red-500 text-xs mt-1">{lgaError}</p>
              )}
              {errors.lga && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.lga.message as string}
                </p>
              )}
            </div>

            <div className="pt-4 flex justify-between">
              <button
                type="button"
                onClick={() => setActiveSection("property")}
                className="text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => setActiveSection("owner")}
                className="bg-[#23A863] text-white px-4 py-2 rounded-lg hover:bg-[#1e8f53] transition-colors"
              >
                Next: Owner
              </button>
            </div>
          </div>
        </div>

        {/* Owner Section */}
        <div className={activeSection === "owner" ? "block" : "hidden"}>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="propertyOwner"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Name of Property Owner (optional)
              </label>
              <input
                id="propertyOwner"
                type="text"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#23A863] focus:border-transparent"
                placeholder="Enter property owner's name"
                {...register("propertyOwner")}
              />
              <p className="mt-1 text-xs text-gray-500">
                Providing the owner's name can help improve search accuracy
              </p>
            </div>

            <div className="pt-8 flex flex-col sm:flex-row justify-between gap-3">
              <button
                type="button"
                onClick={() => setActiveSection("location")}
                className="order-2 sm:order-1 text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={isSearching}
                className="order-1 sm:order-2 bg-[#23A863] text-white px-6 py-2 rounded-lg hover:bg-[#1e8f53] transition-colors flex items-center justify-center gap-2"
              >
                {isSearching ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Searching...</span>
                  </>
                ) : (
                  <>
                    <Search className="h-4 w-4" />
                    <span>Search Property</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* Progress Indicator */}
      <div className="px-4 sm:px-6 pb-6">
        <div className="w-full bg-gray-200 rounded-full h-1.5">
          <div
            className="bg-[#23A863] h-1.5 rounded-full transition-all duration-300"
            style={{
              width:
                activeSection === "property"
                  ? "33.3%"
                  : activeSection === "location"
                  ? "66.6%"
                  : "100%",
            }}
          ></div>
        </div>
        <div className="flex justify-between mt-2 text-xs text-gray-500">
          <span>Property Details</span>
          <span>Location</span>
          <span>Owner</span>
        </div>
      </div>
    </div>
  );
};

export default UsersSearchForm;
