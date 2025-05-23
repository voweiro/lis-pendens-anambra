"use client";

import { useState, useEffect } from "react";
import {
  Loader2,
  Search,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Eye,
  Filter,
  X,
} from "lucide-react";
import { toast } from "react-toastify";
import { getAllCases, deleteCase } from "@/components/utils/api";
import { EditCaseModal } from "./edit-case-modal";
import { CaseDetailsView } from "./case-details-view";

interface CaseItem {
  id: string;
  tile: string; // Changed from title to tile to match API
  title_number?: string;
  survey_plan_number?: string;
  owner_name: string;
  address: string;
  parties?: string;
  suit_number: string;
  court_details?: string;
  date_of_commencement: string;
  date_of_disposal?: string;
  nature_of_case?: string;
  status: string;
  state?: string;
  state_name?: string; // Alternative field name for state
  state_id?: string;
  lga?: string;
  lga_name?: string; // Alternative field name for LGA
  lga_id?: string;
  judicial_division?: string;
  judicial_division_name?: string; // Alternative field name for judicial division
  judicial_division_id?: string;
  division?: string; // Another alternative field name for judicial division
  created_at?: string;
  updated_at?: string;
}

interface CaseListProps {
  refreshTrigger?: boolean;
}

export function CaseList({ refreshTrigger }: CaseListProps = {}) {
  const [cases, setCases] = useState<CaseItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage] = useState(10);
  const [editingCase, setEditingCase] = useState<CaseItem | null>(null);
  const [viewingCase, setViewingCase] = useState<CaseItem | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  // Fetch cases on component mount, page change, or when refreshTrigger changes
  useEffect(() => {
    fetchCases();
  }, [currentPage, refreshTrigger]);

  // Fetch cases from API
  const fetchCases = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await getAllCases();
      console.log(response);

      if (response && Array.isArray(response.data)) {
        setCases(response.data);
        setTotalPages(Math.ceil(response.data.length / itemsPerPage));
      } else if (response && Array.isArray(response)) {
        setCases(response);
        setTotalPages(Math.ceil(response.length / itemsPerPage));
      } else {
        setCases([]);
        setTotalPages(1);
      }
    } catch (error: any) {
      console.error("Error fetching cases:", error);
      setError(error.message || "Failed to fetch cases. Please try again.");
      toast.error(error.message || "Failed to fetch cases");
    } finally {
      setLoading(false);
    }
  };

  // Filter cases based on search term
  const filteredCases = cases.filter(
    (caseItem) =>
      caseItem.tile?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      caseItem.owner_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      caseItem.suit_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      caseItem.status?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (caseItem.state || caseItem.state_name || "")
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (caseItem.lga || caseItem.lga_name || "")
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (
        caseItem.judicial_division ||
        caseItem.judicial_division_name ||
        caseItem.division ||
        ""
      )
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  // Get current page items
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredCases.slice(indexOfFirstItem, indexOfLastItem);

  // Handle page change
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  // Format date for display
  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  // Handle case deletion
  const handleDeleteCase = async (caseId: string) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this case? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      setDeletingId(caseId);
      await deleteCase(caseId);
      toast.success("Case deleted successfully");

      // Reload the cases list after successful deletion
      setTimeout(() => {
        fetchCases();
      }, 1500);
    } catch (error: any) {
      console.error("Error deleting case:", error);
      toast.error(error.message || "Failed to delete case");
    } finally {
      setDeletingId(null);
    }
  };

  // Mobile Card Component
  const CaseCard = ({ caseItem }: { caseItem: CaseItem }) => (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm mb-4">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-gray-900 truncate">
            {caseItem.tile}
          </h3>
          <p className="text-xs text-gray-500 mt-1">
            {caseItem.title_number || "N/A"}
          </p>
        </div>
        <span
          className={`px-2 py-1 text-xs font-semibold rounded-full flex-shrink-0 ml-2
            ${
              caseItem.status.toLowerCase() === "ongoing"
                ? "bg-yellow-100 text-yellow-800"
                : caseItem.status.toLowerCase() === "concluded"
                ? "bg-green-100 text-green-800"
                : "bg-blue-100 text-blue-800"
            }`}
        >
          {caseItem.status}
        </span>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex justify-between">
          <span className="text-xs text-gray-500">Owner:</span>
          <span className="text-xs text-gray-900 text-right flex-1 ml-2 truncate">
            {caseItem.owner_name}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-xs text-gray-500">Suit Number:</span>
          <span className="text-xs text-gray-900 text-right flex-1 ml-2 truncate">
            {caseItem.suit_number}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-xs text-gray-500">Date:</span>
          <span className="text-xs text-gray-900">
            {formatDate(caseItem.date_of_commencement)}
          </span>
        </div>
      </div>

      <div className="flex justify-end space-x-2 pt-2 border-t border-gray-100">
        <button
          className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors"
          onClick={() => setViewingCase(caseItem)}
          title="View case details"
        >
          <Eye className="h-4 w-4" />
        </button>
        <button
          className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
          onClick={() => setEditingCase(caseItem)}
          title="Edit case"
        >
          <Edit className="h-4 w-4" />
        </button>
        <button
          className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
          onClick={() => handleDeleteCase(caseItem.id)}
          disabled={deletingId === caseItem.id}
          title="Delete case"
        >
          {deletingId === caseItem.id ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Trash2 className="h-4 w-4" />
          )}
        </button>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow-sm">
      {/* Header with Search */}
      <div className="p-4 sm:p-6 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h2 className="text-lg font-semibold text-gray-900">Cases</h2>

          {/* Desktop Search */}
          <div className="hidden sm:block relative max-w-md w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search cases..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
          </div>

          {/* Mobile Search Toggle */}
          <button
            className="sm:hidden p-2 text-gray-400 hover:text-gray-600 border border-gray-300 rounded-md"
            onClick={() => setShowMobileSearch(!showMobileSearch)}
          >
            {showMobileSearch ? (
              <X className="h-5 w-5" />
            ) : (
              <Search className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* Mobile Search Input */}
        {showMobileSearch && (
          <div className="mt-4 sm:hidden">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search cases..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 sm:p-6">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <span className="ml-2 text-gray-600">Loading cases...</span>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        ) : currentItems.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            {searchTerm ? "No cases match your search" : "No cases found"}
          </div>
        ) : (
          <>
            {/* Mobile View - Cards */}
            <div className="block lg:hidden">
              {currentItems.map((caseItem) => (
                <CaseCard key={caseItem.id} caseItem={caseItem} />
              ))}
            </div>

            {/* Desktop View - Table */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Property Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Owner Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Suit Number
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentItems.map((caseItem) => (
                    <tr key={caseItem.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {caseItem.tile}
                        </div>
                        <div className="text-sm text-gray-500">
                          {caseItem.title_number || "N/A"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {caseItem.owner_name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {caseItem.suit_number}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${
                              caseItem.status.toLowerCase() === "ongoing"
                                ? "bg-yellow-100 text-yellow-800"
                                : caseItem.status.toLowerCase() === "concluded"
                                ? "bg-green-100 text-green-800"
                                : "bg-blue-100 text-blue-800"
                            }`}
                        >
                          {caseItem.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(caseItem.date_of_commencement)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            className="text-indigo-600 hover:text-indigo-900 p-1"
                            onClick={() => setViewingCase(caseItem)}
                            title="View case details"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            className="text-blue-600 hover:text-blue-900 p-1"
                            onClick={() => setEditingCase(caseItem)}
                            title="Edit case"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            className="text-red-600 hover:text-red-900 p-1"
                            onClick={() => handleDeleteCase(caseItem.id)}
                            disabled={deletingId === caseItem.id}
                            title="Delete case"
                          >
                            {deletingId === caseItem.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
                <div className="text-sm text-gray-500 text-center sm:text-left">
                  Showing {indexOfFirstItem + 1} to{" "}
                  {Math.min(indexOfLastItem, filteredCases.length)} of{" "}
                  {filteredCases.length} cases
                </div>

                {/* Mobile Pagination */}
                <div className="flex items-center space-x-2 sm:hidden">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`p-2 rounded-md ${
                      currentPage === 1
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <span className="text-sm text-gray-600 px-2">
                    {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`p-2 rounded-md ${
                      currentPage === totalPages
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>

                {/* Desktop Pagination */}
                <div className="hidden sm:flex space-x-1">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`px-3 py-1 rounded-md ${
                      currentPage === 1
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                    let page;
                    if (totalPages <= 7) {
                      page = i + 1;
                    } else if (currentPage <= 4) {
                      page = i + 1;
                    } else if (currentPage >= totalPages - 3) {
                      page = totalPages - 6 + i;
                    } else {
                      page = currentPage - 3 + i;
                    }
                    return (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-3 py-1 rounded-md ${
                          currentPage === page
                            ? "bg-blue-600 text-white"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`px-3 py-1 rounded-md ${
                      currentPage === totalPages
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Edit Case Modal */}
      {editingCase && (
        <EditCaseModal
          caseData={editingCase}
          caseId={editingCase.id}
          onClose={() => setEditingCase(null)}
          onSuccess={() => {
            setEditingCase(null);
            fetchCases();
            toast.success("Case updated successfully");
          }}
        />
      )}

      {/* View Case Details Modal */}
      {viewingCase && (
        <CaseDetailsView
          caseData={viewingCase}
          onClose={() => setViewingCase(null)}
        />
      )}
    </div>
  );
}
