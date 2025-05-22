"use client"

import type React from "react"

import { useState } from "react"
import { ChevronDown, X } from "lucide-react"

type CaseStatus = "On appeal" | "Disposed" | "Pending"

interface Case {
  id: string
  propertyTitle: string
  location: string
  status: CaseStatus
  description_of_properties?: string
  subject_matter?: string
  name_of_parties?: string
}

interface CaseDetailsModalProps {
  caseData: Case
  onClose: () => void
  onStatusChange: (newStatus: CaseStatus) => void
}

export function CaseDetailsModal({ caseData, onClose, onStatusChange }: CaseDetailsModalProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [showStatusDropdown, setShowStatusDropdown] = useState(false)
  const [formData, setFormData] = useState({
    propertyTitle: caseData.propertyTitle,
    location: caseData.location,
    status: caseData.status,
    owner: "John Doe", // Example additional data
    titleNumber: "TN-12345",
    surveyPlanNumber: "SPN-67890",
    parties: "Plaintiff vs Defendant",
    name_of_parties: caseData.name_of_parties || "Plaintiff vs Defendant",
    filingDate: "2023-05-15",
    courtReference: "CR-2023-001",
    description: "This case involves a property dispute regarding ownership and boundaries.",
    description_of_properties: caseData.description_of_properties || "",
    subject_matter: caseData.subject_matter || "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleStatusSelect = (status: CaseStatus) => {
    setFormData({
      ...formData,
      status,
    })
    onStatusChange(status)
    setShowStatusDropdown(false)
  }

  const handleSave = () => {
    // Here you would typically save the data to your backend
    setIsEditing(false)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-auto">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white z-10">
          <h2 className="text-xl font-semibold">Case Details</h2>
          <div className="flex items-center gap-4">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-1.5 border border-gray-300 rounded-md text-sm hover:bg-gray-50"
              >
                Edit Case
              </button>
            ) : (
              <button
                onClick={handleSave}
                className="px-4 py-1.5 bg-gray-700 text-white rounded-md text-sm hover:bg-gray-800"
              >
                Save Changes
              </button>
            )}
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Property Title</h3>
              {isEditing ? (
                <input
                  type="text"
                  name="propertyTitle"
                  value={formData.propertyTitle}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-gray-200"
                />
              ) : (
                <p className="text-gray-900">{formData.propertyTitle}</p>
              )}
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Location/Address</h3>
              {isEditing ? (
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-gray-200"
                />
              ) : (
                <p className="text-gray-900">{formData.location}</p>
              )}
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Status</h3>
              {isEditing ? (
                <div className="relative">
                  <button
                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-sm w-full text-left"
                    onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                  >
                    <span>{formData.status}</span>
                    <ChevronDown className="h-4 w-4 ml-auto" />
                  </button>

                  {showStatusDropdown && (
                    <div className="absolute left-0 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg z-10">
                      <div className="py-1">
                        <button
                          className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
                          onClick={() => handleStatusSelect("On appeal")}
                        >
                          <span>On appeal</span>
                          {formData.status === "On appeal" && <span className="ml-auto">✓</span>}
                        </button>
                        <button
                          className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
                          onClick={() => handleStatusSelect("Pending")}
                        >
                          <span>Pending</span>
                          {formData.status === "Pending" && <span className="ml-auto">✓</span>}
                        </button>
                        <button
                          className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
                          onClick={() => handleStatusSelect("Disposed")}
                        >
                          <span>Disposed</span>
                          {formData.status === "Disposed" && <span className="ml-auto">✓</span>}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <StatusBadge status={formData.status} />
              )}
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Property Owner</h3>
              {isEditing ? (
                <input
                  type="text"
                  name="owner"
                  value={formData.owner}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-gray-200"
                />
              ) : (
                <p className="text-gray-900">{formData.owner}</p>
              )}
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Registered Title Number</h3>
              {isEditing ? (
                <input
                  type="text"
                  name="titleNumber"
                  value={formData.titleNumber}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-gray-200"
                />
              ) : (
                <p className="text-gray-900">{formData.titleNumber}</p>
              )}
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Survey Plan Number</h3>
              {isEditing ? (
                <input
                  type="text"
                  name="surveyPlanNumber"
                  value={formData.surveyPlanNumber}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-gray-200"
                />
              ) : (
                <p className="text-gray-900">{formData.surveyPlanNumber}</p>
              )}
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Parties to the Suit/Claim</h3>
              {isEditing ? (
                <input
                  type="text"
                  name="name_of_parties"
                  value={formData.name_of_parties || formData.parties || ""}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-gray-200"
                  required
                />
              ) : (
                <p className="text-gray-900">{formData.name_of_parties || formData.parties || "N/A"}</p>
              )}
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Filing Date</h3>
              {isEditing ? (
                <input
                  type="date"
                  name="filingDate"
                  value={formData.filingDate}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-gray-200"
                />
              ) : (
                <p className="text-gray-900">{formData.filingDate}</p>
              )}
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Court Reference</h3>
              {isEditing ? (
                <input
                  type="text"
                  name="courtReference"
                  value={formData.courtReference}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-gray-200"
                />
              ) : (
                <p className="text-gray-900">{formData.courtReference}</p>
              )}
            </div>
            
            <div className="md:col-span-2">
              <h3 className="text-sm font-medium text-gray-500 mb-1">Description of Properties</h3>
              {isEditing ? (
                <textarea
                  name="description_of_properties"
                  value={formData.description_of_properties}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-gray-200"
                />
              ) : (
                <p className="text-gray-900">{formData.description_of_properties || "No property description available"}</p>
              )}
            </div>
            
            <div className="md:col-span-2">
              <h3 className="text-sm font-medium text-gray-500 mb-1">Subject Matter</h3>
              {isEditing ? (
                <textarea
                  name="subject_matter"
                  value={formData.subject_matter}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-gray-200"
                />
              ) : (
                <p className="text-gray-900">{formData.subject_matter || "No subject matter available"}</p>
              )}
            </div>
          </div>



          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-500 mb-1">Case Description</h3>
            {isEditing ? (
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-gray-200"
              />
            ) : (
              <p className="text-gray-900">{formData.description}</p>
            )}
          </div>

          <div className="mt-6 border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium mb-4">Case History</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-gray-200 flex-shrink-0"></div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium">Admin User</p>
                    <span className="text-sm text-gray-500">2023-05-15 09:30</span>
                  </div>
                  <p className="text-gray-700 mt-1">Case was created and assigned status "On appeal".</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-gray-200 flex-shrink-0"></div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium">Admin User</p>
                    <span className="text-sm text-gray-500">2023-06-20 14:15</span>
                  </div>
                  <p className="text-gray-700 mt-1">Updated case details with new court reference number.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-gray-200 flex justify-end gap-3 sticky bottom-0 bg-white">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Close
          </button>
          {isEditing && (
            <button
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

function StatusBadge({ status }: { status: CaseStatus }) {
  if (status === "On appeal") {
    return (
      <div className="inline-flex items-center">
        <span className="px-3 py-1 text-sm rounded-full border border-red-300 text-red-600">On appeal</span>
      </div>
    )
  }

  if (status === "Disposed") {
    return (
      <div className="inline-flex items-center">
        <span className="px-3 py-1 text-sm rounded-full border border-green-300 text-green-600">Disposed</span>
      </div>
    )
  }

  return (
    <div className="inline-flex items-center">
      <span className="px-3 py-1 text-sm rounded-full border border-orange-300 text-orange-600">Pending</span>
    </div>
  )
}
