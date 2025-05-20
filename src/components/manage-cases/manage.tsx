"use client"

import { useState } from "react"
import { ChevronDown, Edit, MoreHorizontal, Plus, Search, Trash2 } from "lucide-react"
import { CaseDetailsModal } from "./case-detail-modal"
import { UploadModal } from "./upload"


type CaseStatus = "On appeal" | "Disposed" | "Pending"

interface Case {
  id: string
  propertyTitle: string
  location: string
  status: CaseStatus
}

export function CaseManagement() {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const [showStatusDropdown, setShowStatusDropdown] = useState(false)
  const [statusFilter, setStatusFilter] = useState<CaseStatus | null>(null)
  const [selectedCase, setSelectedCase] = useState<Case | null>(null)
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)

  const [cases, setCases] = useState<Case[]>([
    {
      id: "1",
      propertyTitle: "Deelaw Housing & Real Estates Ag...",
      location: "Plot 1-5 Lamido crescent, Abuja",
      status: "On appeal",
    },
    {
      id: "2",
      propertyTitle: "Golden boys Estate",
      location: "5 apple avenue Nomansland, Jos",
      status: "On appeal",
    },
    {
      id: "3",
      propertyTitle: "Okpara & sons real estates",
      location: "2/3 Russel avenue Taurani, kano",
      status: "Disposed",
    },
  ])

  const filteredCases = statusFilter ? cases.filter((c) => c.status === statusFilter) : cases

  const handleStatusSelect = (status: CaseStatus) => {
    setStatusFilter(status)
    setShowStatusDropdown(false)
  }

  const handleStatusChange = (caseId: string, newStatus: CaseStatus) => {
    setCases(cases.map((c) => (c.id === caseId ? { ...c, status: newStatus } : c)))
  }

  const handleDeleteCase = (caseId: string) => {
    if (window.confirm("Are you sure you want to delete this case?")) {
      setCases(cases.filter((c) => c.id !== caseId))
    }
  }

  const toggleMenu = (caseId: string) => {
    setOpenMenuId(openMenuId === caseId ? null : caseId)
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Manage cases</h1>
          <p className="text-gray-600 text-sm mt-1">Track your searches and manage overall activities</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search"
              className="pl-3 pr-10 py-2 border border-gray-300 rounded-full w-[200px] focus:outline-none focus:ring-2 focus:ring-gray-200"
            />
            <Search className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
          </div>

          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
            <img src="/placeholder.svg?height=40&width=40" alt="User avatar" className="h-10 w-10 rounded-full" />
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="search cases"
            className="pl-10 pr-3 py-2 border border-gray-300 rounded-md w-full max-w-md focus:outline-none focus:ring-2 focus:ring-gray-200"
          />
        </div>

        <button
          onClick={() => setIsUploadModalOpen(true)}
          className="flex items-center gap-1 bg-gray-700 text-white rounded-md py-2 px-4 hover:bg-gray-800 transition-colors"
        >
          <Plus className="h-5 w-5" />
          <span>Upload new</span>
        </button>
      </div>

      <div className="mt-8 bg-white rounded-lg p-6 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Uploaded cases</h2>

          <div className="relative">
            <button
              className="flex items-center gap-2 px-4 py-1.5 border border-gray-300 rounded-full text-sm"
              onClick={() => setShowStatusDropdown(!showStatusDropdown)}
            >
              <span>Sort by</span>
              <ChevronDown className="h-4 w-4" />
            </button>

            {showStatusDropdown && (
              <div className="absolute right-0 mt-1 w-40 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                <div className="py-1">
                  <button
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
                    onClick={() => handleStatusSelect("On appeal")}
                  >
                    <span>On appeal</span>
                    {statusFilter === "On appeal" && <span className="ml-auto">✓</span>}
                  </button>
                  <button
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
                    onClick={() => handleStatusSelect("Pending")}
                  >
                    <span>Pending</span>
                    {statusFilter === "Pending" && <span className="ml-auto">✓</span>}
                  </button>
                  <button
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
                    onClick={() => handleStatusSelect("Disposed")}
                  >
                    <span>Disposed</span>
                    {statusFilter === "Disposed" && <span className="ml-auto">✓</span>}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left pb-3 font-medium text-gray-600">Property Title (cert of occupancy)</th>
                <th className="text-left pb-3 font-medium text-gray-600">Location/Address of Property</th>
                <th className="text-left pb-3 font-medium text-gray-600">Status</th>
                <th className="text-left pb-3 font-medium text-gray-600"></th>
                <th className="text-left pb-3 font-medium text-gray-600"></th>
              </tr>
            </thead>
            <tbody>
              {filteredCases.map((caseItem) => (
                <tr key={caseItem.id} className="border-b border-gray-100">
                  <td className="py-4">{caseItem.propertyTitle}</td>
                  <td className="py-4">{caseItem.location}</td>
                  <td className="py-4">
                    <StatusBadge
                      status={caseItem.status}
                      onClick={() => {
                        const nextStatus = getNextStatus(caseItem.status)
                        handleStatusChange(caseItem.id, nextStatus)
                      }}
                    />
                  </td>
                  <td className="py-4">
                    <button
                      className="text-gray-600 border border-gray-300 rounded-md px-3 py-1 text-sm hover:bg-gray-50"
                      onClick={() => setSelectedCase(caseItem)}
                    >
                      See Details
                    </button>
                  </td>
                  <td className="py-4 relative">
                    <button
                      className="text-gray-600 p-1 rounded-md hover:bg-gray-100"
                      onClick={() => toggleMenu(caseItem.id)}
                    >
                      <MoreHorizontal className="h-5 w-5" />
                    </button>

                    {openMenuId === caseItem.id && (
                      <div className="absolute right-0 mt-1 w-40 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                        <div className="py-1">
                          <button
                            className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
                            onClick={() => {
                              setSelectedCase(caseItem)
                              setOpenMenuId(null)
                            }}
                          >
                            <Edit className="h-4 w-4" />
                            <span>Edit Case</span>
                          </button>
                          <button
                            className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2 text-red-600"
                            onClick={() => {
                              handleDeleteCase(caseItem.id)
                              setOpenMenuId(null)
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                            <span>Delete Case</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isUploadModalOpen && <UploadModal onClose={() => setIsUploadModalOpen(false)} />}
      {selectedCase && (
        <CaseDetailsModal
          caseData={selectedCase}
          onClose={() => setSelectedCase(null)}
          onStatusChange={(newStatus) => {
            handleStatusChange(selectedCase.id, newStatus)
            setSelectedCase({ ...selectedCase, status: newStatus })
          }}
        />
      )}
    </div>
  )
}

function getNextStatus(currentStatus: CaseStatus): CaseStatus {
  switch (currentStatus) {
    case "On appeal":
      return "Pending"
    case "Pending":
      return "Disposed"
    case "Disposed":
      return "On appeal"
    default:
      return "Pending"
  }
}

interface StatusBadgeProps {
  status: CaseStatus
  onClick?: () => void
}

function StatusBadge({ status, onClick }: StatusBadgeProps) {
  if (status === "On appeal") {
    return (
      <button onClick={onClick} className="inline-flex items-center gap-1 cursor-pointer">
        <span className="px-3 py-1 text-sm rounded-full border border-red-300 text-red-600">On appeal</span>
        <ChevronDown className="h-4 w-4 text-red-600" />
      </button>
    )
  }

  if (status === "Disposed") {
    return (
      <button onClick={onClick} className="inline-flex items-center gap-1 cursor-pointer">
        <span className="px-3 py-1 text-sm rounded-full border border-green-300 text-green-600">Disposed</span>
        <ChevronDown className="h-4 w-4 text-green-600" />
      </button>
    )
  }

  return (
    <button onClick={onClick} className="inline-flex items-center gap-1 cursor-pointer">
      <span className="px-3 py-1 text-sm rounded-full border border-orange-300 text-orange-600">Pending</span>
      <ChevronDown className="h-4 w-4 text-orange-600" />
    </button>
  )
}
