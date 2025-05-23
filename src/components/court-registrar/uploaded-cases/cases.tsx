"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, MoreHorizontal, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/utils/buttons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/utils/dropdown-menu";
import { GetAllCases } from "@/Services/AuthRequest/auth.request";
import { toast } from "react-toastify";
import { CaseDetailsModal } from "./case-details-modal";

type CaseStatus = "ongoing" | "pending" | "concluded";

interface Case {
  id: string;
  tile?: string; // Note: API has a typo, using 'tile' instead of 'title'
  title?: string; // Keep this for backward compatibility
  address?: string;
  status: CaseStatus;
  owner_name?: string;
  suit_number?: string;
  date_of_commencement?: string;
  date_of_disposal?: string;
  court_details?: string;
  nature_of_case?: string;
  judicial_division_id?: string;
  state_id?: string;
  lga_id?: string;
  created_at?: string;
  updated_at?: string;
  title_number?: string;
  survey_plan_number?: string;
  parties?: string;
  description_of_properties?: string; // New field
  subject_matter?: string; // New field
  street?: string;
  city?: string;
  plot_number?: string;
  user_id?: string;
}

export default function CaseListing() {
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [selectedCase, setSelectedCase] = useState<Case | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const dropdownRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  useEffect(() => {
    const fetchCases = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await GetAllCases();
        console.log("Fetched cases:", response);

        if (response.success && response.data) {
          console.log("Fetched cases:", response.data);

          // Log the first case to check if the new fields are present

          if (response.data.length > 0) {
            console.log("First case details:", response.data[0]);
            console.log("parties:", response.data[0].parties);
            console.log(
              "description_of_properties:",
              response.data[0].description_of_properties
            );
            console.log("subject_matter:", response.data[0].subject_matter);
          }

          setCases(response.data);
        } else {
          console.error("Failed to fetch cases:", response.error);
          setError(response.error || "Failed to fetch cases");
          toast.error(response.error || "Failed to fetch cases");
        }
      } catch (err) {
        console.error("Error fetching cases:", err);
        setError("An unexpected error occurred");
        toast.error("An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchCases();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openDropdownId) {
        const dropdownRef = dropdownRefs.current[openDropdownId];
        if (dropdownRef && !dropdownRef.contains(event.target as Node)) {
          setOpenDropdownId(null);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openDropdownId]);

  // If no cases are loaded and there's no error, show loading state
  if (loading && cases.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
        <p className="text-gray-600">Loading cases...</p>
      </div>
    );
  }

  // If there's an error and no cases, show error message
  if (error && cases.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="bg-red-50 p-4 rounded-md mb-4">
          <p className="text-red-600">{error}</p>
        </div>
        <Button onClick={() => window.location.reload()} variant="outline">
          Retry
        </Button>
      </div>
    );
  }

  const itemsPerPage = 10;
  const totalPages = Math.ceil(cases.length / itemsPerPage);

  // Get current cases
  const indexOfLastCase = currentPage * itemsPerPage;
  const indexOfFirstCase = indexOfLastCase - itemsPerPage;
  const currentCases = cases.slice(indexOfFirstCase, indexOfLastCase);

  // Change page
  const goToNextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const goToPreviousPage = () =>
    setCurrentPage((prev) => Math.max(prev - 1, 1));

  // Update case status
  const updateCaseStatus = (id: string, newStatus: CaseStatus) => {
    // Close the dropdown
    setOpenDropdownId(null);

    // Update the case status in the local state
    setCases((prevCases) =>
      prevCases.map((caseItem) =>
        caseItem.id === id ? { ...caseItem, status: newStatus } : caseItem
      )
    );

    // Here you would typically make an API call to update the status on the server
    toast.success(`Case status updated to ${newStatus}`);
  };

  const handleViewDetails = (caseItem: Case) => {
    // Create a complete case object with all fields explicitly copied
    const completeCase = {
      ...caseItem,
      // Ensure new fields are explicitly included
      parties: caseItem.parties || "",
      description_of_properties: caseItem.description_of_properties || "",
      subject_matter: caseItem.subject_matter || "",
    };

    console.log("Viewing case details with complete data:", completeCase);
    console.log("parties:", completeCase.parties);
    console.log(
      "description_of_properties:",
      completeCase.description_of_properties
    );
    console.log("subject_matter:", completeCase.subject_matter);

    setSelectedCase(completeCase);
    setShowDetailsModal(true);
  };

  const handleCloseModal = () => {
    setShowDetailsModal(false);
    setSelectedCase(null);
  };

  const toggleDropdown = (caseId: string) => {
    setOpenDropdownId(openDropdownId === caseId ? null : caseId);
  };

  const getStatusColor = (status: CaseStatus) => {
    switch (status) {
      case "pending":
        return "text-amber-600 border-amber-500 bg-amber-50";
      case "ongoing":
        return "text-red-600 border-red-500 bg-red-50";
      case "concluded":
        return "text-green-600 border-green-500 bg-green-50";
      default:
        return "text-gray-700 border-gray-500 bg-gray-50";
    }
  };

  return (
    <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
      {/* Mobile Card View (xs to md) */}
      <div className="block lg:hidden">
        <div className="space-y-4">
          {currentCases.map((caseItem) => (
            <div
              key={caseItem.id}
              className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <div className="p-4 sm:p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">
                      {caseItem.tile || caseItem.title || "Untitled Case"}
                    </h3>
                    {caseItem.address && (
                      <p className="text-sm text-gray-600 mt-1">
                        {caseItem.address}
                      </p>
                    )}
                  </div>
                  <div className="ml-4 flex-shrink-0">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                        >
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem>Delete</DropdownMenuItem>
                        <DropdownMenuItem>Archive</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                {/* Status and Actions */}
                <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between gap-3">
                  <div
                    className="relative"
                    ref={(el) => {
                      dropdownRefs.current[caseItem.id] = el;
                    }}
                  >
                    <button
                      className={`inline-flex items-center px-3 py-1.5 rounded-full border text-sm font-medium ${getStatusColor(
                        caseItem.status
                      )}`}
                      onClick={() => toggleDropdown(caseItem.id)}
                    >
                      {caseItem.status} <ChevronDown className="ml-1 h-3 w-3" />
                    </button>

                    {/* Custom Dropdown */}
                    {openDropdownId === caseItem.id && (
                      <div className="absolute z-50 mt-1 w-48 rounded-lg shadow-lg bg-white border border-gray-200">
                        <div className="py-1">
                          <button
                            className="flex w-full items-center justify-between px-4 py-2.5 hover:bg-gray-50 text-left"
                            onClick={() =>
                              updateCaseStatus(caseItem.id, "pending")
                            }
                          >
                            <span className="text-amber-600">Pending</span>
                            {caseItem.status === "pending" && (
                              <Check className="h-4 w-4 text-amber-600" />
                            )}
                          </button>
                          <button
                            className="flex w-full items-center justify-between px-4 py-2.5 hover:bg-gray-50 text-left"
                            onClick={() =>
                              updateCaseStatus(caseItem.id, "ongoing")
                            }
                          >
                            <span className="text-red-600">Ongoing</span>
                            {caseItem.status === "ongoing" && (
                              <Check className="h-4 w-4 text-red-600" />
                            )}
                          </button>
                          <button
                            className="flex w-full items-center justify-between px-4 py-2.5 hover:bg-gray-50 text-left"
                            onClick={() =>
                              updateCaseStatus(caseItem.id, "concluded")
                            }
                          >
                            <span className="text-green-600">Concluded</span>
                            {caseItem.status === "concluded" && (
                              <Check className="h-4 w-4 text-green-600" />
                            )}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full xs:w-auto h-9 px-4 rounded-lg font-medium"
                    onClick={() => handleViewDetails(caseItem)}
                  >
                    See Details
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Desktop Table View (lg and up) */}
      <div className="hidden lg:block">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-6 px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div className="col-span-4 font-semibold text-gray-700">
              Case Title
            </div>
            <div className="col-span-3 font-semibold text-gray-700">
              Address
            </div>
            <div className="col-span-2 font-semibold text-gray-700">Status</div>
            <div className="col-span-3 font-semibold text-gray-700 text-right">
              Actions
            </div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-gray-100">
            {currentCases.map((caseItem) => (
              <div
                key={caseItem.id}
                className="grid grid-cols-12 gap-6 px-6 py-4 items-center hover:bg-gray-50 transition-colors duration-150"
              >
                <div className="col-span-4">
                  <div className="font-medium text-gray-900 line-clamp-2">
                    {caseItem.tile || caseItem.title || "Untitled Case"}
                  </div>
                </div>
                <div className="col-span-3">
                  <div className="text-gray-600 line-clamp-2">
                    {caseItem.address || "No address"}
                  </div>
                </div>
                <div className="col-span-2">
                  <div
                    className="relative"
                    ref={(el) => {
                      dropdownRefs.current[caseItem.id] = el;
                    }}
                  >
                    <button
                      className={`inline-flex items-center px-3 py-1.5 rounded-full border text-sm font-medium ${getStatusColor(
                        caseItem.status
                      )}`}
                      onClick={() => toggleDropdown(caseItem.id)}
                    >
                      {caseItem.status} <ChevronDown className="ml-1 h-3 w-3" />
                    </button>

                    {/* Custom Dropdown */}
                    {openDropdownId === caseItem.id && (
                      <div className="absolute z-50 mt-1 w-48 rounded-lg shadow-lg bg-white border border-gray-200">
                        <div className="py-1">
                          <button
                            className="flex w-full items-center justify-between px-4 py-2.5 hover:bg-gray-50 text-left"
                            onClick={() =>
                              updateCaseStatus(caseItem.id, "pending")
                            }
                          >
                            <span className="text-amber-600">Pending</span>
                            {caseItem.status === "pending" && (
                              <Check className="h-4 w-4 text-amber-600" />
                            )}
                          </button>
                          <button
                            className="flex w-full items-center justify-between px-4 py-2.5 hover:bg-gray-50 text-left"
                            onClick={() =>
                              updateCaseStatus(caseItem.id, "ongoing")
                            }
                          >
                            <span className="text-red-600">Ongoing</span>
                            {caseItem.status === "ongoing" && (
                              <Check className="h-4 w-4 text-red-600" />
                            )}
                          </button>
                          <button
                            className="flex w-full items-center justify-between px-4 py-2.5 hover:bg-gray-50 text-left"
                            onClick={() =>
                              updateCaseStatus(caseItem.id, "concluded")
                            }
                          >
                            <span className="text-green-600">Concluded</span>
                            {caseItem.status === "concluded" && (
                              <Check className="h-4 w-4 text-green-600" />
                            )}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="col-span-3 flex items-center justify-end space-x-3">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-9 px-4 rounded-lg font-medium"
                    onClick={() => handleViewDetails(caseItem)}
                  >
                    See Details
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-9 w-9 p-0 rounded-lg"
                      >
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem>Delete</DropdownMenuItem>
                      <DropdownMenuItem>Archive</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Enhanced Pagination */}
      <div className="mt-6 bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="flex flex-col sm:flex-row items-center justify-between px-4 sm:px-6 py-4">
          {/* Results Info */}
          <div className="mb-4 sm:mb-0">
            <p className="text-sm text-gray-700">
              Showing{" "}
              <span className="font-semibold">{indexOfFirstCase + 1}</span> to{" "}
              <span className="font-semibold">
                {Math.min(indexOfLastCase, cases.length)}
              </span>{" "}
              of <span className="font-semibold">{cases.length}</span> results
            </p>
          </div>

          {/* Mobile Pagination */}
          <div className="flex sm:hidden w-full space-x-3">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 h-10 rounded-lg font-medium"
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <div className="flex items-center px-4 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium">
                {currentPage} / {totalPages}
              </span>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="flex-1 h-10 rounded-lg font-medium"
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>

          {/* Desktop Pagination */}
          <div className="hidden sm:flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              className="h-10 px-4 rounded-lg font-medium"
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
            >
              Previous
            </Button>

            {/* Page Numbers */}
            <div className="flex items-center space-x-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <Button
                    key={pageNum}
                    variant={currentPage === pageNum ? "default" : "outline"}
                    size="sm"
                    className="h-10 w-10 rounded-lg font-medium"
                    onClick={() => setCurrentPage(pageNum)}
                  >
                    {pageNum}
                  </Button>
                );
              })}
            </div>

            <Button
              variant="outline"
              size="sm"
              className="h-10 px-4 rounded-lg font-medium"
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      </div>

      {/* Case Details Modal */}
      {showDetailsModal && selectedCase && (
        <CaseDetailsModal
          caseData={selectedCase}
          onClose={handleCloseModal}
          onStatusChange={updateCaseStatus}
        />
      )}
    </div>
  );
}
