"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/utils/buttons";
import { Input } from "@/components/utils/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/utils/dialog";
import {
  Check,
  Upload,
  AlertCircle,
  ChevronDown,
  X,
  Download,
} from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import {
  GetStates,
  GetLGAs,
  GetJudicialDivisions,
} from "@/Services/AuthRequest/auth.request";

type FormStep = 1 | 2 | 3;

interface CaseFormData {
  title?: string;
  title_number?: string;
  survey_plan_number?: string;
  owner_name?: string;
  address?: string;
  parties?: string;
  name_of_parties?: string;
  suit_number?: string;
  court_details?: string;
  date_of_commencement?: string;
  date_of_disposal?: string;
  nature_of_case?: string;
  status?: string;
  state_id?: string;
  state?: string;
  lga_id?: string;
  lga?: string;
  judicial_division_id?: string;
  judicial_division?: string;
  description_of_properties?: string;
  subject_matter?: string;
}

interface StateOption {
  id: string;
  label: string;
  active: boolean;
}

interface LgaOption {
  id: string;
  label: string;
  active: boolean;
}

interface JudicialDivisionOption {
  id: string;
  label: string;
  active: boolean;
}

export default function UploadCaseForm() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<FormStep>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<CaseFormData>({});
  const [uploadMethod, setUploadMethod] = useState<"manual" | "csv">("manual");

  // State, LGA, and Judicial Division management
  const [states, setStates] = useState<StateOption[]>([]);
  const [lgas, setLgas] = useState<LgaOption[]>([]);
  const [judicialDivisions, setJudicialDivisions] = useState<
    JudicialDivisionOption[]
  >([]);
  const [loadingStates, setLoadingStates] = useState(false);
  const [loadingLgas, setLoadingLgas] = useState(false);
  const [loadingJudicialDivisions, setLoadingJudicialDivisions] =
    useState(false);
  const [stateDropdownOpen, setStateDropdownOpen] = useState(false);
  const [lgaDropdownOpen, setLgaDropdownOpen] = useState(false);
  const [judicialDivisionDropdownOpen, setJudicialDivisionDropdownOpen] =
    useState(false);

  const baseURL = process.env.NEXT_PUBLIC_URL || "";

  // Fetch judicial divisions on component mount
  useEffect(() => {
    const fetchJudicialDivisions = async () => {
      try {
        console.log("Fetching judicial divisions...");
        setLoadingJudicialDivisions(true);
        const divisionsData = await GetJudicialDivisions();
        console.log("Raw judicial divisions response:", divisionsData);

        if (Array.isArray(divisionsData) && divisionsData.length > 0) {
          setJudicialDivisions(divisionsData);
          console.log("Judicial divisions loaded successfully:", divisionsData);
        } else {
          console.warn(
            "Judicial divisions API returned empty or invalid data:",
            divisionsData
          );
          // Try to load some default judicial divisions as fallback
          const defaultDivisions = [
            { id: "1", label: "Division 1", active: true },
            { id: "2", label: "Division 2", active: true },
            { id: "3", label: "Division 3", active: true },
          ];
          setJudicialDivisions(defaultDivisions);
          console.log("Loaded default judicial divisions as fallback");
        }
      } catch (error) {
        console.error("Error fetching judicial divisions:", error);
        // Set default judicial divisions on error
        const defaultDivisions = [
          { id: "1", label: "Division 1", active: true },
          { id: "2", label: "Division 2", active: true },
          { id: "3", label: "Division 3", active: true },
        ];
        setJudicialDivisions(defaultDivisions);
        console.log("Loaded default judicial divisions due to error");
      } finally {
        setLoadingJudicialDivisions(false);
      }
    };

    fetchJudicialDivisions();
  }, []);

  // Fetch states on component mount
  useEffect(() => {
    const fetchStates = async () => {
      try {
        console.log("Fetching states...");
        setLoadingStates(true);
        const statesData = await GetStates();
        console.log("Raw states response:", statesData);

        if (Array.isArray(statesData) && statesData.length > 0) {
          setStates(statesData);
          console.log("States loaded successfully:", statesData);
        } else {
          console.warn(
            "States API returned empty or invalid data:",
            statesData
          );
          // Try to load some default states as fallback
          const defaultStates = [
            { id: "1", label: "Lagos", active: true },
            { id: "2", label: "Abuja", active: true },
            { id: "3", label: "Rivers", active: true },
            { id: "4", label: "Kano", active: true },
          ];
          setStates(defaultStates);
          console.log("Using default states as fallback");
        }
      } catch (error) {
        console.error("Error fetching states:", error);
        toast.error("Failed to load states");

        // Set default states as fallback
        const defaultStates = [
          { id: "1", label: "Lagos", active: true },
          { id: "2", label: "Abuja", active: true },
          { id: "3", label: "Rivers", active: true },
          { id: "4", label: "Kano", active: true },
        ];
        setStates(defaultStates);
        console.log("Using default states as fallback after error");
      } finally {
        setLoadingStates(false);
      }
    };

    fetchStates();
  }, []);

  // Fetch LGAs when state changes
  useEffect(() => {
    const fetchLgas = async () => {
      if (!formData.state_id) {
        setLgas([]);
        return;
      }

      try {
        console.log("Fetching LGAs for state ID:", formData.state_id);
        setLoadingLgas(true);
        const lgasData = await GetLGAs(formData.state_id);
        console.log("Raw LGAs response:", lgasData);

        if (Array.isArray(lgasData) && lgasData.length > 0) {
          setLgas(lgasData);
          console.log("LGAs loaded successfully:", lgasData);
        } else {
          console.warn("LGA API returned empty or invalid data:", lgasData);

          // Set default LGAs based on selected state
          let defaultLgas: LgaOption[] = [];

          // Default LGAs for Lagos (state_id: 1)
          if (formData.state_id === "1") {
            defaultLgas = [
              { id: "1", label: "Ikeja", active: true },
              { id: "2", label: "Lagos Island", active: true },
              { id: "3", label: "Lekki", active: true },
            ];
          }
          // Default LGAs for Abuja (state_id: 2)
          else if (formData.state_id === "2") {
            defaultLgas = [
              { id: "4", label: "Abuja Municipal", active: true },
              { id: "5", label: "Gwagwalada", active: true },
            ];
          }
          // Default LGAs for other states
          else {
            defaultLgas = [
              { id: "6", label: "LGA 1", active: true },
              { id: "7", label: "LGA 2", active: true },
            ];
          }

          setLgas(defaultLgas);
          console.log("Using default LGAs as fallback");
        }
      } catch (error) {
        console.error("Error fetching LGAs:", error);
        toast.error("Failed to load local governments");

        // Set default LGAs as fallback
        const defaultLgas = [
          { id: "1", label: "LGA 1", active: true },
          { id: "2", label: "LGA 2", active: true },
        ];
        setLgas(defaultLgas);
        console.log("Using default LGAs as fallback after error");
      } finally {
        setLoadingLgas(false);
      }
    };

    fetchLgas();
  }, [formData.state_id]);

  // Form navigation functions
  const handleOpen = () => {
    setOpen(true);
    setStep(1);
    setFormData({});
    setError(null);
  };

  const handleClose = () => {
    setOpen(false);
    setStep(1);
    setFormData({});
    setError(null);
  };

  // Function to go to step 2 directly
  const goToStep2 = () => {
    setStep(2);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;

    // Map form field IDs to API field names
    const fieldMapping: Record<string, keyof CaseFormData> = {
      propertyTitle: "title",
      titleNumber: "title_number",
      surveyNumber: "survey_plan_number",
      ownerName: "owner_name",
      location: "address",
      parties: "parties",
      description_of_properties: "description_of_properties",
      subject_matter: "subject_matter",
      suitNumber: "suit_number",
      court: "court_details",
      commencementDate: "date_of_commencement",
      disposalDate: "date_of_disposal",
      natureDispute: "nature_of_case",
      status: "status",
    };

    const apiField = fieldMapping[id];
    if (apiField) {
      setFormData((prev) => ({
        ...prev,
        [apiField]: value,
      }));
    }
  };

  // Handle state selection
  const handleStateSelect = (state: StateOption) => {
    // Update form data with selected state
    setFormData((prev) => ({
      ...prev,
      state_id: state.id,
      state: state.label,
      // Clear LGA when state changes
      lga_id: "",
      lga: "",
    }));

    // Close dropdown
    setStateDropdownOpen(false);
  };

  // Handle LGA selection
  const handleLgaSelect = (lga: LgaOption) => {
    // Update form data with selected LGA
    setFormData((prev) => ({
      ...prev,
      lga_id: lga.id,
      lga: lga.label,
    }));

    // Close dropdown
    setLgaDropdownOpen(false);
  };

  // Handle judicial division selection
  const handleJudicialDivisionSelect = (division: JudicialDivisionOption) => {
    setFormData((prev) => ({
      ...prev,
      judicial_division_id: division.id,
      judicial_division: division.label,
    }));
    setJudicialDivisionDropdownOpen(false);
  };

  const handleNext = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    console.log("Next button clicked, validating form data:", formData);

    // Validate first step fields
    const requiredFields = [
      { field: "title", label: "Property Title" },
      { field: "owner_name", label: "Owner Name" },
      { field: "address", label: "Location" },
      { field: "parties", label: "Parties to the Suit/Claim" },
      { field: "description_of_properties", label: "Description of Properties" },
      { field: "subject_matter", label: "Subject Matter" },
      { field: "state_id", label: "State" },
      { field: "lga_id", label: "Local Government Area" },
      { field: "judicial_division_id", label: "Judicial Division" },
    ];

    const missingFields = requiredFields.filter(
      (item) => !formData[item.field as keyof CaseFormData]
    );

    if (missingFields.length > 0) {
      const missingFieldNames = missingFields
        .map((item) => item.label)
        .join(", ");
      toast.error(`Please fill in all required fields: ${missingFieldNames}`);
      return;
    }

    // All validations passed, proceed to next step
    console.log("Validation passed, proceeding to step 2");
    setStep(2);
  };

  const handleBack = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setStep(1);
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Get auth token from session storage using multiple possible sources
      let authToken = null;

      // Try getting the token directly from the token storage
      const tokenStr = sessionStorage.getItem("token");
      if (tokenStr) {
        console.log("Found token in session storage:", tokenStr);
        authToken = tokenStr;
      }

      // If that fails, try getting it from the auth object
      if (!authToken) {
        const authStr = sessionStorage.getItem("auth");
        if (authStr) {
          try {
            const auth = JSON.parse(authStr);

            if (auth.accessToken) {
              authToken = auth.accessToken;
            } else if (auth.data && auth.data.token) {
              authToken = auth.data.token;
            } else if (auth.token) {
              authToken = auth.token;
            }
          } catch (error) {
            console.error("Error parsing auth data:", error);
          }
        }
      }

      // Try localStorage as a fallback
      if (!authToken) {
        const localAuthStr = localStorage.getItem("auth");
        if (localAuthStr) {
          try {
            const localAuth = JSON.parse(localAuthStr);
            if (localAuth.token) {
              authToken = localAuth.token;
            } else if (localAuth.data && localAuth.data.token) {
              authToken = localAuth.data.token;
            }
          } catch (error) {
            console.error("Error parsing local auth data:", error);
          }
        }
      }

      if (!authToken) {
        throw new Error("Authentication token not found. Please log in again.");
      }

      console.log("Using auth token:", authToken);

      // Validate required fields before submission based on API error message
      const requiredFields = [
        { field: "title", label: "Title" },
        { field: "owner_name", label: "Owner Name" },
        { field: "parties", label: "Parties to the Suit/Claim" },
        { field: "description_of_properties", label: "Description of Properties" },
        { field: "subject_matter", label: "Subject Matter" },
      ];

      // Check for empty required fields
      const missingFields = requiredFields.filter((item) => {
        const value = formData[item.field as keyof CaseFormData];
        return !value || value.trim() === "";
      });

      if (missingFields.length > 0) {
        const missingFieldNames = missingFields
          .map((item) => item.label)
          .join(", ");
        const errorMessage = `The ${missingFieldNames} field is required.`;
        console.error(errorMessage);
        setError(errorMessage);
        toast.error(errorMessage);
        throw new Error(errorMessage);
      }

      // Prepare the request payload based exactly on the Postman screenshots
      const payload = {
        // Fields from first Postman screenshot
        tile: formData.title || "",
        title_number: formData.title_number || "",
        survey_plan_number: formData.survey_plan_number || "",
        owner_name: formData.owner_name || "",
        address: formData.address || "",
        parties: formData.parties || "",
        name_of_parties: formData.name_of_parties || "",
        description_of_properties: formData.description_of_properties || "",
        subject_matter: formData.subject_matter || "",
        suit_number: formData.suit_number || "",
        court_details: formData.court_details || "",
        date_of_commencement: formData.date_of_commencement || "",
        nature_of_case: formData.nature_of_case || "",

        // Fields from second Postman screenshot
        date_of_disposal: formData.date_of_disposal || "",
        lga_id: formData.lga_id || "",
        state_id: formData.state_id || "",
        judicial_division_id: formData.judicial_division_id || "1", // Use the selected judicial division ID from the form
        status: formData.status || "ongoing",
      };

      console.log("Using judicial division ID:", formData.judicial_division_id);

      console.log("Payload exactly matching Postman:", payload);

      console.log("Sending case data:", payload);

      // Make the API call
      const response = await axios.post(
        `${baseURL}/court-staff/cases`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      console.log("Case created successfully:", response.data);
      toast.success("Case created successfully");

      // Show success state
      setStep(3);

      // Auto close the success modal after 3 seconds
      setTimeout(() => {
        handleClose();
      }, 3000);
    } catch (error: any) {
      console.error("Error creating case:", error);
      setError(
        error.response?.data?.message ||
          error.message ||
          "Failed to create case"
      );
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to create case"
      );
    } finally {
      setLoading(false);
    }
  };

  // Handle CSV file upload
  const handleCsvUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      toast.error("Please select a CSV file");
      return;
    }

    // Check if it's a CSV file
    if (file.type !== "text/csv" && !file.name.endsWith(".csv")) {
      toast.error("Please upload a valid CSV file");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Get authentication token
      let authToken = "";

      if (typeof window !== "undefined") {
        // Try multiple possible storage locations for the token
        const directToken = sessionStorage.getItem("token");
        if (directToken) {
          authToken = directToken;
        } else {
          const authData = sessionStorage.getItem("auth");
          if (authData) {
            try {
              const parsedData = JSON.parse(authData);
              if (parsedData.token) {
                authToken = parsedData.token;
              } else if (parsedData.accessToken) {
                authToken = parsedData.accessToken;
              } else if (parsedData.data && parsedData.data.token) {
                authToken = parsedData.data.token;
              }
            } catch (error) {
              console.error("Error parsing auth data:", error);
            }
          }
        }
      }

      if (!authToken) {
        throw new Error("Authentication token not found. Please log in again.");
      }

      // Create form data for file upload
      const formDataObj = new FormData();
      formDataObj.append("csv_file", file);

      // Make API request to upload CSV
      const baseUrl = process.env.NEXT_PUBLIC_URL || "";
      const response = await axios.post(
        `${baseUrl}/court-staff/cases/csv`,
        formDataObj,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            Accept: "application/json",
            // Don't set Content-Type here, it will be set automatically with the correct boundary
          },
        }
      );

      console.log("CSV upload response:", response.data);
      toast.success("Cases uploaded successfully from CSV");

      // Show success state
      setStep(3);

      // Auto close the success modal after 3 seconds
      setTimeout(() => {
        handleClose();
      }, 3000);
    } catch (error: any) {
      console.error("Error uploading CSV:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.errors?.csv_file ||
        error.message ||
        "Failed to upload CSV";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
      // Reset the file input
      e.target.value = "";
    }
  };

  // Generate and download a sample CSV template
  const downloadSampleCsv = () => {
    // CSV header and sample data
    const csvHeader =
      "title,title_number,survey_plan_number,owner_name,state, lga, judicial-division, parties,suit_number,court_number, date_of_commencement,date_of_disposal,nature_of_case,status,judicial_division_id";
    const sampleData = [
      "Property Title 1,TN12345,SP98765,John Doe,123 Main St Lagos,Party A vs Party B,SN2023/001,High Court Lagos,2023-01-15,,Land Dispute,pending,1",
      "Property Title 2,TN67890,SP54321,Jane Smith,456 Park Ave Abuja,Party C vs Party D,SN2023/002,Federal High Court Abuja,2022-11-20,2023-05-10,Ownership Dispute,concluded,2",
    ].join("\n");

    const csvContent = `${csvHeader}\n${sampleData}`;

    // Create a blob and download link
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "case_upload_template.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success("Sample CSV template downloaded");
  };

  return (
    <>
      <Button onClick={handleOpen} className="flex items-center gap-2">
        <Upload className="h-4 w-4" />
        <span>Upload case</span>
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        {step === 3 ? (
          <DialogContent className="sm:max-w-md">
            <div className="flex flex-col items-center justify-center py-6">
              <div className="mb-4 bg-green-100 p-3 rounded-full">
                <Check className="h-6 w-6 text-green-600" />
              </div>
              <p className="text-base font-medium">Case Uploaded</p>
            </div>
          </DialogContent>
        ) : (
          <DialogContent className=" bg-white sm:max-w-md p-0">
            <DialogHeader className="bg-green-600 text-white p-4">
              <DialogTitle className="flex justify-between items-center">
                <span>
                  Upload Case -{" "}
                  {step === 1 ? "Property Details" : "Case Details"}
                </span>
                <button
                  onClick={handleClose}
                  className="rounded-full hover:bg-green-700 p-1"
                >
                  <X className="h-4 w-4" />
                </button>
              </DialogTitle>
            </DialogHeader>

            {step === 1 && (
              <div className="px-4 pt-4">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-sm">Upload Method:</span>
                  <div className="flex bg-gray-100 rounded-md p-1">
                    <button
                      onClick={() => setUploadMethod("manual")}
                      className={`px-3 py-1 text-sm rounded-md ${
                        uploadMethod === "manual"
                          ? "bg-white shadow-sm text-green-600"
                          : "text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      Manual Entry
                    </button>
                    <button
                      onClick={() => setUploadMethod("csv")}
                      className={`px-3 py-1 text-sm rounded-md ${
                        uploadMethod === "csv"
                          ? "bg-white shadow-sm text-green-600"
                          : "text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      CSV Upload
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="p-4 max-h-[60vh] overflow-y-auto">
              {step === 1 && uploadMethod === "csv" ? (
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <p className="text-sm text-gray-500 mb-4">
                      Upload a CSV file containing multiple case records
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-3">
                      <div>
                        <input
                          id="csv-upload"
                          type="file"
                          accept=".csv"
                          className="hidden"
                          onChange={handleCsvUpload}
                        />
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={() => {
                            document.getElementById("csv-upload")?.click();
                          }}
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          Select CSV File
                        </Button>
                      </div>
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={downloadSampleCsv}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download Template
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className=" space-y-4">
                  {step === 1 ? (
                    // Step 1: Property Details
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label
                          htmlFor="propertyTitle"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Property Title <span className="text-red-500">*</span>
                        </label>
                        <Input
                          id="propertyTitle"
                          placeholder="Enter property title"
                          value={formData.title || ""}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="space-y-1">
                        <label
                          htmlFor="titleNumber"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Title Number
                        </label>
                        <Input
                          id="titleNumber"
                          placeholder="Enter title number"
                          value={formData.title_number || ""}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="space-y-1">
                        <label
                          htmlFor="location"
                          className="text-sm font-medium text-gray-700"
                        >
                          Location of Property{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <Input
                          id="location"
                          placeholder="House/Plot No, Street, Area"
                          value={formData.address || ""}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="space-y-1">
                        <label
                          htmlFor="surveyNumber"
                          className="text-sm font-medium text-gray-700"
                        >
                          Survey Plan Number
                        </label>
                        <Input
                          id="surveyNumber"
                          placeholder="Enter survey plan number"
                          value={formData.survey_plan_number || ""}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="space-y-1">
                        <label
                          htmlFor="ownerName"
                          className="text-sm font-medium text-gray-700"
                        >
                          Property Owner Name{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <Input
                          id="ownerName"
                          placeholder="Enter property owner name"
                          value={formData.owner_name || ""}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="space-y-1">
                        <label
                          htmlFor="parties"
                          className="text-sm font-medium text-gray-700"
                        >
                          Parties to the Suit/Claim <span className="text-red-500">*</span>
                        </label>
                        <Input
                          id="parties"
                          name="parties"
                          placeholder="e.g. Party A vs Party B"
                          value={formData.parties || ""}
                          onChange={(e) => {
                            setFormData(prev => ({
                              ...prev,
                              parties: e.target.value
                            }));
                          }}
                          required
                        />
                      </div>
                      
                      <div className="space-y-1">
                        <label
                          htmlFor="name_of_parties"
                          className="text-sm font-medium text-gray-700"
                        >
                          Name of Parties <span className="text-red-500">*</span>
                        </label>
                        <Input
                          id="name_of_parties"
                          name="name_of_parties"
                          placeholder="e.g. John Doe, Jane Smith"
                          value={formData.name_of_parties || ""}
                          onChange={(e) => {
                            setFormData(prev => ({
                              ...prev,
                              name_of_parties: e.target.value
                            }));
                          }}
                          required
                        />
                      </div>

                      {/* State Dropdown */}
                      <div className="space-y-1">
                        <label className="block text-sm font-medium text-gray-700">
                          State <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <button
                            type="button"
                            className="w-full flex items-center justify-between px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-sm text-gray-700 hover:bg-gray-50"
                            onClick={() =>
                              setStateDropdownOpen(!stateDropdownOpen)
                            }
                            disabled={loadingStates}
                          >
                            <span>
                              {formData.state ||
                                (loadingStates
                                  ? "Loading states..."
                                  : "Select state")}
                            </span>
                            <ChevronDown className="h-4 w-4" />
                          </button>

                          {stateDropdownOpen && (
                            <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-40 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                              {states.map((state) => (
                                <div
                                  key={state.id}
                                  className="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-gray-100"
                                  onClick={() => handleStateSelect(state)}
                                >
                                  {state.label}
                                </div>
                              ))}
                              {states.length === 0 && !loadingStates && (
                                <div className="py-2 px-3 text-gray-500">
                                  No states available
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* LGA Dropdown */}
                      <div className="space-y-1">
                        <label className="block text-sm font-medium text-gray-700">
                          Local Government Area{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <button
                            type="button"
                            className="w-full flex items-center justify-between px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-sm text-gray-700 hover:bg-gray-50"
                            onClick={() => setLgaDropdownOpen(!lgaDropdownOpen)}
                            disabled={loadingLgas || !formData.state_id}
                          >
                            <span>
                              {formData.lga ||
                                (loadingLgas
                                  ? "Loading local governments..."
                                  : !formData.state_id
                                  ? "Select state first"
                                  : "Select local government")}
                            </span>
                            <ChevronDown className="h-4 w-4" />
                          </button>

                          {lgaDropdownOpen && (
                            <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-40 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                              {lgas.map((lga) => (
                                <div
                                  key={lga.id}
                                  className="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-gray-100"
                                  onClick={() => handleLgaSelect(lga)}
                                >
                                  {lga.label}
                                </div>
                              ))}
                              {lgas.length === 0 &&
                                !loadingLgas &&
                                formData.state_id && (
                                  <div className="py-2 px-3 text-gray-500">
                                    No local governments available
                                  </div>
                                )}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Judicial Division Dropdown */}
                      <div className="space-y-1 md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Judicial Division{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <button
                            type="button"
                            className="w-full flex items-center justify-between px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-sm text-gray-700 hover:bg-gray-50"
                            onClick={() =>
                              setJudicialDivisionDropdownOpen(
                                !judicialDivisionDropdownOpen
                              )
                            }
                            disabled={loadingJudicialDivisions}
                          >
                            <span>
                              {formData.judicial_division ||
                                (loadingJudicialDivisions
                                  ? "Loading judicial divisions..."
                                  : "Select judicial division")}
                            </span>
                            <ChevronDown className="h-4 w-4" />
                          </button>

                          {judicialDivisionDropdownOpen && (
                            <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-40 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                              {judicialDivisions.map((division) => (
                                <div
                                  key={division.id}
                                  className="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-gray-100"
                                  onClick={() =>
                                    handleJudicialDivisionSelect(division)
                                  }
                                >
                                  {division.label}
                                </div>
                              ))}
                              {judicialDivisions.length === 0 &&
                                !loadingJudicialDivisions && (
                                  <div className="py-2 px-3 text-gray-500">
                                    No judicial divisions available
                                  </div>
                                )}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Description of Properties */}
                      <div className="space-y-1 md:col-span-2">
                        <label
                          htmlFor="description_of_properties"
                          className="text-sm font-medium text-gray-700"
                        >
                          Description of Properties <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          id="description_of_properties"
                          placeholder="Enter detailed description of the properties involved"
                          value={formData.description_of_properties || ""}
                          onChange={handleInputChange}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                          rows={3}
                        />
                      </div>

                      {/* Subject Matter */}
                      <div className="space-y-1 md:col-span-2">
                        <label
                          htmlFor="subject_matter"
                          className="text-sm font-medium text-gray-700"
                        >
                          Subject Matter <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          id="subject_matter"
                          placeholder="Enter the subject matter of the case"
                          value={formData.subject_matter || ""}
                          onChange={handleInputChange}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                          rows={3}
                        />
                      </div>
                    </div>
                  ) : (
                    // Step 2: Case Details
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label
                          htmlFor="suitNumber"
                          className="text-sm font-medium text-gray-700"
                        >
                          Suit Number <span className="text-red-500">*</span>
                        </label>
                        <Input
                          id="suitNumber"
                          placeholder="e.g. SN2023/001"
                          value={formData.suit_number || ""}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="space-y-1">
                        <label
                          htmlFor="natureDispute"
                          className="text-sm font-medium text-gray-700"
                        >
                          Nature of Dispute{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <Input
                          id="natureDispute"
                          placeholder="e.g. Land Dispute, Ownership"
                          value={formData.nature_of_case || ""}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="space-y-1">
                        <label
                          htmlFor="court"
                          className="text-sm font-medium text-gray-700"
                        >
                          Court and Judicial Division{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <Input
                          id="court"
                          placeholder="e.g. High Court Lagos"
                          value={formData.court_details || ""}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="space-y-1">
                        <label
                          htmlFor="status"
                          className="text-sm font-medium text-gray-700"
                        >
                          Status of Dispute{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <Input
                          id="status"
                          placeholder="ongoing / pending / concluded"
                          value={formData.status || ""}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="space-y-1">
                        <label
                          htmlFor="commencementDate"
                          className="text-sm font-medium text-gray-700"
                        >
                          Date of Commencement{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <Input
                          id="commencementDate"
                          type="date"
                          value={formData.date_of_commencement || ""}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="space-y-1">
                        <label
                          htmlFor="disposalDate"
                          className="text-sm font-medium text-gray-700"
                        >
                          Date of Disposal
                        </label>
                        <Input
                          id="disposalDate"
                          type="date"
                          value={formData.date_of_disposal || ""}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                  )}

                  {error && (
                    <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md flex items-center">
                      <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                      <span className="text-sm">{error}</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="border-t p-4 flex justify-between">
              {step === 1 ? (
                <>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleClose}
                    disabled={loading}
                    className="text-sm px-4 py-2"
                  >
                    Cancel
                  </Button>
                  {uploadMethod === "manual" && (
                    <Button
                      type="button"
                      onClick={goToStep2}
                      disabled={loading}
                      className="bg-green-600 hover:bg-green-700 text-white text-sm px-4 py-2"
                    >
                      Next Step
                    </Button>
                  )}
                </>
              ) : (
                <>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleBack}
                    disabled={loading}
                    className="text-sm px-4 py-2"
                  >
                    Back
                  </Button>
                  <Button
                    type="button"
                    onClick={handleSubmit}
                    disabled={loading}
                    className="bg-green-600 hover:bg-green-700 text-white text-sm px-4 py-2"
                  >
                    {loading ? "Submitting..." : "Submit"}
                  </Button>
                </>
              )}
            </div>
          </DialogContent>
        )}
      </Dialog>
    </>
  );
}
