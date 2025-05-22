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
        
        if (response.success && response.data) {
          console.log('Fetched cases:', response.data);
          
          // Log the first case to check if the new fields are present
          if (response.data.length > 0) {
            console.log('First case details:', response.data[0]);
            console.log('name_of_parties:', response.data[0].name_of_parties);
            console.log('description_of_properties:', response.data[0].description_of_properties);
            console.log('subject_matter:', response.data[0].subject_matter);
          }
          
          setCases(response.data);
        } else {
          console.error('Failed to fetch cases:', response.error);
          setError(response.error || 'Failed to fetch cases');
          toast.error(response.error || 'Failed to fetch cases');
        }
      } catch (err) {
        console.error('Error fetching cases:', err);
        setError('An unexpected error occurred');
        toast.error('An unexpected error occurred');
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
  const currentCases = cases.slice(
    indexOfFirstCase,
    indexOfLastCase
  );

  // Change page
  const goToNextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const goToPreviousPage = () =>
    setCurrentPage((prev) => Math.max(prev - 1, 1));

  // Update case status
  const updateCaseStatus = (
    id: string,
    newStatus: CaseStatus
  ) => {
    // Close the dropdown
    setOpenDropdownId(null);
    
    // Update the case status in the local state
    setCases(prevCases =>
      prevCases.map(caseItem =>
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
      subject_matter: caseItem.subject_matter || ""
    };
    
    console.log('Viewing case details with complete data:', completeCase);
    console.log('parties:', completeCase.parties);
    console.log('description_of_properties:', completeCase.description_of_properties);
    console.log('subject_matter:', completeCase.subject_matter);
    
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
    <div className="w-full max-w-[882px] border border-blue-300 rounded-lg overflow-hidden">
      {/* Table Header */}
      <div className="grid grid-cols-[2fr_2fr_1fr_1fr] gap-4 p-4 border-b border-gray-200 bg-gray-50">
        <div className="font-medium text-gray-700">
          Case Title
        </div>
        <div className="font-medium text-gray-700">
          Address
        </div>
        <div className="font-medium text-gray-700">Status</div>
        <div className="font-medium text-gray-700"></div>
      </div>

      {/* Table Body */}
      <div className="divide-y divide-gray-200">
        {currentCases.map((caseItem) => (
          <div
            key={caseItem.id}
            className="grid grid-cols-[2fr_2fr_1fr_1fr] gap-4 p-4 items-center"
          >
            <div className="font-medium">{caseItem.tile || caseItem.title || "Untitled Case"}</div>
            <div className="text-gray-600">{caseItem.address}</div>
            <div
              className="relative"
              ref={(el) => {
                dropdownRefs.current[caseItem.id] = el;
              }}
            >
              <button
                className={`inline-flex items-center px-3 py-1 rounded-full border ${getStatusColor(
                  caseItem.status
                )}`}
                onClick={() => toggleDropdown(caseItem.id)}
              >
                {caseItem.status} <ChevronDown className="ml-1 h-4 w-4" />
              </button>

              {/* Custom Dropdown */}
              {openDropdownId === caseItem.id && (
                <div className="absolute z-50 mt-1 w-[200px] rounded-md shadow-lg bg-[#4A3E3E] ring-1 ring-black ring-opacity-5">
                  <div className="py-1 divide-y divide-gray-700">
                    <button
                      className="flex w-full items-center justify-between px-4 py-2.5 hover:bg-[#5A4E4E]"
                      onClick={() =>
                        updateCaseStatus(caseItem.id, "pending")
                      }
                    >
                      <span className="text-amber-400">Pending</span>
                      {caseItem.status === "pending" && (
                        <Check className="h-4 w-4 text-amber-400" />
                      )}
                    </button>
                    <button
                      className="flex w-full items-center justify-between px-4 py-2.5 hover:bg-[#5A4E4E]"
                      onClick={() =>
                        updateCaseStatus(caseItem.id, "ongoing")
                      }
                    >
                      <span className="text-red-400">Ongoing</span>
                      {caseItem.status === "ongoing" && (
                        <Check className="h-4 w-4 text-red-400" />
                      )}
                    </button>
                    <button
                      className="flex w-full items-center justify-between px-4 py-2.5 hover:bg-[#5A4E4E]"
                      onClick={() =>
                        updateCaseStatus(caseItem.id, "concluded")
                      }
                    >
                      <span className="text-green-400">Concluded</span>
                      {caseItem.status === "concluded" && (
                        <Check className="h-4 w-4 text-green-400" />
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
            <div className="flex items-center justify-end space-x-2">
              <Button
                variant="outline"
                size="sm"
                className="h-8 px-3 rounded-md"
                onClick={() => handleViewDetails(caseItem)}
              >
                See Details
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
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

      {/* Pagination */}
      <div className="flex items-center justify-between border-t border-gray-200 bg-gray-50 px-4 py-3">
        <div className="flex flex-1 justify-between sm:hidden">
          <Button
            variant="outline"
            size="sm"
            onClick={goToPreviousPage}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Showing{" "}
              <span className="font-medium">{indexOfFirstCase + 1}</span> to{" "}
              <span className="font-medium">
                {Math.min(indexOfLastCase, cases.length)}
              </span>{" "}
              of <span className="font-medium">{cases.length}</span>{" "}
              results
            </p>
          </div>
          <div>
            <nav
              className="isolate inline-flex -space-x-px rounded-md shadow-sm"
              aria-label="Pagination"
            >
              <Button
                variant="outline"
                size="sm"
                className="rounded-l-md"
                onClick={goToPreviousPage}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <div className="flex items-center px-4">
                <span className="text-sm">
                  Page {currentPage} of {totalPages}
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="rounded-r-md"
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </nav>
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