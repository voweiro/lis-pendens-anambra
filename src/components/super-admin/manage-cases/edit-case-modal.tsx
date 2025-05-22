"use client"

import { useState, useEffect } from "react"
import { X, Check, ChevronDown, AlertCircle, Loader2 } from "lucide-react"
import { toast } from "react-toastify"
import { updateCase, type CaseData } from "@/components/utils/api"
import { GetStates, GetLGAs, GetJudicialDivisions } from "@/Services/AuthRequest/auth.request"

interface EditCaseModalProps {
  caseData: CaseData;
  caseId: string;
  onClose: () => void;
  onSuccess?: () => void;
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

export function EditCaseModal({ caseData: initialCaseData, caseId, onClose, onSuccess }: EditCaseModalProps) {
  const [formStep, setFormStep] = useState(1) // Track form steps: 1 for property details, 2 for case details
  const [formData, setFormData] = useState<CaseData>(initialCaseData || {})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // State, LGA, and Judicial Division management
  const [states, setStates] = useState<StateOption[]>([])
  const [lgas, setLgas] = useState<LgaOption[]>([])
  const [judicialDivisions, setJudicialDivisions] = useState<JudicialDivisionOption[]>([])
  const [loadingStates, setLoadingStates] = useState(false)
  const [loadingLgas, setLoadingLgas] = useState(false)
  const [loadingJudicialDivisions, setLoadingJudicialDivisions] = useState(false)
  const [stateDropdownOpen, setStateDropdownOpen] = useState(false)
  const [lgaDropdownOpen, setLgaDropdownOpen] = useState(false)
  const [judicialDivisionDropdownOpen, setJudicialDivisionDropdownOpen] = useState(false)

  // Fetch states, LGAs, and judicial divisions on component mount
  useEffect(() => {
    fetchStates()
    fetchJudicialDivisions()
    
    // If state_id is available, fetch LGAs for that state
    if (formData.state_id) {
      fetchLgas(formData.state_id)
    }
  }, [])

  // Fetch states
  const fetchStates = async () => {
    try {
      setLoadingStates(true)
      const statesData = await GetStates()
      if (Array.isArray(statesData) && statesData.length > 0) {
        setStates(statesData)
      } else {
        // Fallback to default states
        const defaultStates = [
          { id: "1", label: "Lagos", active: true },
          { id: "2", label: "Abuja", active: true },
          { id: "3", label: "Rivers", active: true },
        ]
        setStates(defaultStates)
      }
    } catch (error) {
      console.error("Error fetching states:", error)
      // Set default states on error
      const defaultStates = [
        { id: "1", label: "Lagos", active: true },
        { id: "2", label: "Abuja", active: true },
        { id: "3", label: "Rivers", active: true },
      ]
      setStates(defaultStates)
    } finally {
      setLoadingStates(false)
    }
  }

  // Fetch LGAs based on selected state
  const fetchLgas = async (stateId: string) => {
    try {
      setLoadingLgas(true)
      const lgasData = await GetLGAs(stateId)
      if (Array.isArray(lgasData) && lgasData.length > 0) {
        setLgas(lgasData)
      } else {
        // Fallback to default LGAs
        const defaultLgas = [
          { id: "1", label: "LGA 1", active: true },
          { id: "2", label: "LGA 2", active: true },
          { id: "3", label: "LGA 3", active: true },
        ]
        setLgas(defaultLgas)
      }
    } catch (error) {
      console.error("Error fetching LGAs:", error)
      // Set default LGAs on error
      const defaultLgas = [
        { id: "1", label: "LGA 1", active: true },
        { id: "2", label: "LGA 2", active: true },
        { id: "3", label: "LGA 3", active: true },
      ]
      setLgas(defaultLgas)
    } finally {
      setLoadingLgas(false)
    }
  }

  // Fetch judicial divisions
  const fetchJudicialDivisions = async () => {
    try {
      setLoadingJudicialDivisions(true)
      const divisionsData = await GetJudicialDivisions()
      if (Array.isArray(divisionsData) && divisionsData.length > 0) {
        setJudicialDivisions(divisionsData)
      } else {
        // Fallback to default judicial divisions
        const defaultDivisions = [
          { id: "1", label: "Division 1", active: true },
          { id: "2", label: "Division 2", active: true },
          { id: "3", label: "Division 3", active: true },
        ]
        setJudicialDivisions(defaultDivisions)
      }
    } catch (error) {
      console.error("Error fetching judicial divisions:", error)
      // Set default judicial divisions on error
      const defaultDivisions = [
        { id: "1", label: "Division 1", active: true },
        { id: "2", label: "Division 2", active: true },
        { id: "3", label: "Division 3", active: true },
      ]
      setJudicialDivisions(defaultDivisions)
    } finally {
      setLoadingJudicialDivisions(false)
    }
  }

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    let fieldName = id

    // Map input IDs to API field names
    switch (id) {
      // Step 1: Property Details
      case "propertyTitle":
        fieldName = "tile"
        break
      case "titleNumber":
        fieldName = "title_number"
        break
      case "surveyPlanNumber":
        fieldName = "survey_plan_number"
        break
      case "ownerName":
        fieldName = "owner_name"
        break
      case "location":
        fieldName = "address"
        break
      case "parties":
        fieldName = "parties"
        break
      
      // Step 2: Case Details
      case "suitNumber":
        fieldName = "suit_number"
        break
      case "natureOfCase":
        fieldName = "nature_of_case"
        break
      case "courtDetails":
        fieldName = "court_details"
        break
      case "statusOfDispute":
        fieldName = "status"
        break
      case "dateOfCommencement":
        fieldName = "date_of_commencement"
        break
      case "dateOfDisposal":
        fieldName = "date_of_disposal"
        break
    }

    setFormData((prev) => ({
      ...prev,
      [fieldName]: value,
    }))
  }

  // Handle state selection
  const handleStateSelect = (state: StateOption) => {
    setFormData((prev) => ({
      ...prev,
      state_id: state.id,
      state: state.label,
    }))
    setStateDropdownOpen(false)
    fetchLgas(state.id)
  }

  // Handle LGA selection
  const handleLgaSelect = (lga: LgaOption) => {
    setFormData((prev) => ({
      ...prev,
      lga_id: lga.id,
      lga: lga.label,
    }))
    setLgaDropdownOpen(false)
  }

  // Handle judicial division selection
  const handleJudicialDivisionSelect = (division: JudicialDivisionOption) => {
    setFormData((prev) => ({
      ...prev,
      judicial_division_id: division.id,
      judicial_division: division.label,
    }))
    setJudicialDivisionDropdownOpen(false)
  }

  // Handle next step in form
  const handleNextStep = () => {
    // Validate step 1 fields
    if (formStep === 1) {
      const requiredStep1Fields = [
        { field: "tile", label: "Property Title" },
        { field: "owner_name", label: "Property Owner Name" },
        { field: "address", label: "Location of Property" },
        { field: "state_id", label: "State" },
        { field: "lga_id", label: "LGA" },
      ]

      for (const { field, label } of requiredStep1Fields) {
        if (!formData[field as keyof CaseData]) {
          setError(`${label} is required`)
          return
        }
      }

      setFormStep(2)
      setError(null)
    }
  }

  // Handle previous step in form
  const handlePreviousStep = () => {
    setFormStep(1)
    setError(null)
  }

  // Handle form submission
  const handleSubmit = async () => {
    // Validate step 2 fields
    const requiredStep2Fields = [
      { field: "suit_number", label: "Suit Number" },
      { field: "nature_of_case", label: "Nature of Dispute" },
      { field: "court_details", label: "Court and Judicial Division" },
      { field: "status", label: "Status of Dispute" },
      { field: "date_of_commencement", label: "Date of Commencement" },
    ]

    for (const { field, label } of requiredStep2Fields) {
      if (!formData[field as keyof CaseData]) {
        setError(`${label} is required`)
        return
      }
    }

    setLoading(true)
    setError(null)

    try {
      const response = await updateCase(caseId, formData)
      console.log("Case updated successfully:", response)
      toast.success("Case updated successfully")
      
      // Call the onSuccess callback if provided
      if (onSuccess) {
        onSuccess()
      }
      onClose()
    } catch (error: any) {
      console.error("Error updating case:", error)
      setError(error.message || "Failed to update case. Please try again.")
      toast.error(error.message || "Failed to update case")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white z-10">
          <h2 className="text-lg font-semibold">Edit Case</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {error && (
          <div className="mx-4 mt-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-start">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
            <span className="text-red-700 text-sm">{error}</span>
          </div>
        )}

        <div className="overflow-y-auto flex-1">
          <div className="p-6">
            <div className="space-y-4">
              {formStep === 1 ? (
                // Step 1: Property Details
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label htmlFor="propertyTitle" className="block text-sm font-medium text-gray-700">
                      Property Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="propertyTitle"
                      type="text"
                      placeholder="Enter property title"
                      value={formData.tile || ""}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="titleNumber" className="block text-sm font-medium text-gray-700">
                      Title Number
                    </label>
                    <input
                      id="titleNumber"
                      type="text"
                      placeholder="Enter title number"
                      value={formData.title_number || ""}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="surveyPlanNumber" className="block text-sm font-medium text-gray-700">
                      Survey Plan Number
                    </label>
                    <input
                      id="surveyPlanNumber"
                      type="text"
                      placeholder="Enter survey plan number"
                      value={formData.survey_plan_number || ""}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="ownerName" className="block text-sm font-medium text-gray-700">
                      Property Owner Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="ownerName"
                      type="text"
                      placeholder="Enter owner name"
                      value={formData.owner_name || ""}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div className="space-y-1 md:col-span-2">
                    <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                      Location of Property <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="location"
                      type="text"
                      placeholder="Enter property location"
                      value={formData.address || ""}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">
                      State <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <button
                        type="button"
                        className="w-full p-2 border border-gray-300 rounded-md bg-white flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        onClick={() => setStateDropdownOpen(!stateDropdownOpen)}
                      >
                        <span>{formData.state || "Select state"}</span>
                        <ChevronDown className="h-4 w-4 text-gray-500" />
                      </button>

                      {stateDropdownOpen && (
                        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
                          {loadingStates ? (
                            <div className="p-2 text-center text-gray-500">Loading states...</div>
                          ) : (
                            <div className="py-1">
                              {states.map((state) => (
                                <button
                                  key={state.id}
                                  className="w-full text-left px-4 py-2 hover:bg-gray-100"
                                  onClick={() => handleStateSelect(state)}
                                >
                                  {state.label}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">
                      LGA <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <button
                        type="button"
                        className={`w-full p-2 border border-gray-300 rounded-md bg-white flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          !formData.state_id ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                        onClick={() => formData.state_id && setLgaDropdownOpen(!lgaDropdownOpen)}
                        disabled={!formData.state_id}
                      >
                        <span>{formData.lga || "Select LGA"}</span>
                        <ChevronDown className="h-4 w-4 text-gray-500" />
                      </button>

                      {lgaDropdownOpen && (
                        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
                          {loadingLgas ? (
                            <div className="p-2 text-center text-gray-500">Loading LGAs...</div>
                          ) : (
                            <div className="py-1">
                              {lgas.map((lga) => (
                                <button
                                  key={lga.id}
                                  className="w-full text-left px-4 py-2 hover:bg-gray-100"
                                  onClick={() => handleLgaSelect(lga)}
                                >
                                  {lga.label}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-1 md:col-span-2">
                    <label htmlFor="parties" className="block text-sm font-medium text-gray-700">
                      Parties Involved
                    </label>
                    <input
                      id="parties"
                      type="text"
                      placeholder="Enter parties involved"
                      value={formData.parties || ""}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              ) : (
                // Step 2: Case Details
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label htmlFor="suitNumber" className="block text-sm font-medium text-gray-700">
                      Suit Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="suitNumber"
                      type="text"
                      placeholder="Enter suit number"
                      value={formData.suit_number || ""}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="natureOfCase" className="block text-sm font-medium text-gray-700">
                      Nature of Dispute <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="natureOfCase"
                      type="text"
                      placeholder="Enter nature of dispute"
                      value={formData.nature_of_case || ""}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">
                      Judicial Division
                    </label>
                    <div className="relative">
                      <button
                        type="button"
                        className="w-full p-2 border border-gray-300 rounded-md bg-white flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        onClick={() => setJudicialDivisionDropdownOpen(!judicialDivisionDropdownOpen)}
                      >
                        <span>{formData.judicial_division || "Select judicial division"}</span>
                        <ChevronDown className="h-4 w-4 text-gray-500" />
                      </button>

                      {judicialDivisionDropdownOpen && (
                        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
                          {loadingJudicialDivisions ? (
                            <div className="p-2 text-center text-gray-500">Loading judicial divisions...</div>
                          ) : (
                            <div className="py-1">
                              {judicialDivisions.map((division) => (
                                <button
                                  key={division.id}
                                  className="w-full text-left px-4 py-2 hover:bg-gray-100"
                                  onClick={() => handleJudicialDivisionSelect(division)}
                                >
                                  {division.label}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="courtDetails" className="block text-sm font-medium text-gray-700">
                      Court and Judicial Division <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="courtDetails"
                      type="text"
                      placeholder="Enter court details"
                      value={formData.court_details || ""}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="statusOfDispute" className="block text-sm font-medium text-gray-700">
                      Status of Dispute <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="statusOfDispute"
                      type="text"
                      placeholder="Enter status of dispute"
                      value={formData.status || ""}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="dateOfCommencement" className="block text-sm font-medium text-gray-700">
                      Date of Commencement <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="dateOfCommencement"
                      type="date"
                      value={formData.date_of_commencement || ""}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="dateOfDisposal" className="block text-sm font-medium text-gray-700">
                      Date of Disposal
                    </label>
                    <input
                      id="dateOfDisposal"
                      type="date"
                      value={formData.date_of_disposal || ""}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-gray-200 flex justify-end gap-3">
          {formStep === 1 ? (
            <>
              <button
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 transition-colors"
                type="button"
              >
                Cancel
              </button>
              <button
                onClick={handleNextStep}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                type="button"
              >
                Next
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handlePreviousStep}
                className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 transition-colors"
                type="button"
              >
                Previous
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors flex items-center justify-center min-w-[100px]"
                type="button"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin mr-2" />
                    <span>Updating...</span>
                  </>
                ) : (
                  <span>Update Case</span>
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
