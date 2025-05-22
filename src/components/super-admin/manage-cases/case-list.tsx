"use client"

import { useState, useEffect } from "react"
import { Loader2, Search, Edit, Trash2, ChevronLeft, ChevronRight, Eye } from "lucide-react"
import { toast } from "react-toastify"
import { getAllCases, deleteCase } from "@/components/utils/api"
import { EditCaseModal } from "./edit-case-modal"
import { CaseDetailsView } from "./case-details-view"

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
  const [cases, setCases] = useState<CaseItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [itemsPerPage] = useState(10)
  const [editingCase, setEditingCase] = useState<CaseItem | null>(null)
  const [viewingCase, setViewingCase] = useState<CaseItem | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  // Fetch cases on component mount, page change, or when refreshTrigger changes
  useEffect(() => {
    fetchCases()
  }, [currentPage, refreshTrigger])

  // Fetch cases from API
  const fetchCases = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await getAllCases()
      
      if (response && Array.isArray(response.data)) {
        setCases(response.data)
        setTotalPages(Math.ceil(response.data.length / itemsPerPage))
      } else if (response && Array.isArray(response)) {
        setCases(response)
        setTotalPages(Math.ceil(response.length / itemsPerPage))
      } else {
        setCases([])
        setTotalPages(1)
      }
    } catch (error: any) {
      console.error("Error fetching cases:", error)
      setError(error.message || "Failed to fetch cases. Please try again.")
      toast.error(error.message || "Failed to fetch cases")
    } finally {
      setLoading(false)
    }
  }

  // Filter cases based on search term
  const filteredCases = cases.filter(caseItem => 
    caseItem.tile?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    caseItem.owner_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    caseItem.suit_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    caseItem.status?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (caseItem.state || caseItem.state_name || "")?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (caseItem.lga || caseItem.lga_name || "")?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (caseItem.judicial_division || caseItem.judicial_division_name || caseItem.division || "")?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Get current page items
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredCases.slice(indexOfFirstItem, indexOfLastItem)

  // Handle page change
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber)
  }

  // Format date for display
  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleDateString()
  }
  
  // Handle case deletion
  const handleDeleteCase = async (caseId: string) => {
    if (!window.confirm("Are you sure you want to delete this case? This action cannot be undone.")) {
      return
    }
    
    try {
      setDeletingId(caseId)
      await deleteCase(caseId)
      toast.success("Case deleted successfully")
      
      // Reload the cases list after successful deletion
      setTimeout(() => {
        fetchCases()
      }, 1500)
    } catch (error: any) {
      console.error("Error deleting case:", error)
      toast.error(error.message || "Failed to delete case")
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-xl font-semibold text-gray-800">All Cases</h2>
        
        <div className="relative w-full md:w-64">
          <input
            type="text"
            placeholder="Search cases..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
        </div>
      </div>

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
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left pb-3 font-medium text-gray-600">Property Title (cert of occupancy)</th>
                  <th className="text-left pb-3 font-medium text-gray-600">Location/Address of Property</th>
                  <th className="text-left pb-3 font-medium text-gray-600">Status</th>
                  <th className="text-left pb-3 font-medium text-gray-600">Date</th>
                  <th className="text-left pb-3 font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentItems.map((caseItem) => (
                  <tr key={caseItem.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{caseItem.tile}</div>
                      <div className="text-sm text-gray-500">{caseItem.title_number || "N/A"}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{caseItem.owner_name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{caseItem.suit_number}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${caseItem.status.toLowerCase() === "ongoing" ? "bg-yellow-100 text-yellow-800" : 
                          caseItem.status.toLowerCase() === "concluded" ? "bg-green-100 text-green-800" : 
                          "bg-blue-100 text-blue-800"}`}>
                        {caseItem.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(caseItem.date_of_commencement)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button 
                        className="text-indigo-600 hover:text-indigo-900 mr-3"
                        onClick={() => setViewingCase(caseItem)}
                        title="View case details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button 
                        className="text-blue-600 hover:text-blue-900 mr-3"
                        onClick={() => setEditingCase(caseItem)}
                        title="Edit case"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button 
                        className="text-red-600 hover:text-red-900"
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
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center mt-6">
              <div className="text-sm text-gray-500">
                Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredCases.length)} of {filteredCases.length} cases
              </div>
              <div className="flex space-x-1">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`px-3 py-1 rounded-md ${
                    currentPage === 1 ? "text-gray-400 cursor-not-allowed" : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
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
                ))}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-1 rounded-md ${
                    currentPage === totalPages ? "text-gray-400 cursor-not-allowed" : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          )}
        </>
      )}
      
      {/* Edit Case Modal */}
      {editingCase && (
        <EditCaseModal
          caseData={editingCase}
          caseId={editingCase.id}
          onClose={() => setEditingCase(null)}
          onSuccess={() => {
            setEditingCase(null)
            fetchCases()
            toast.success("Case updated successfully")
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
  )
}
