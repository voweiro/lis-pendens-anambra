"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { X, Check, ChevronDown, AlertCircle, Loader2 } from "lucide-react"
import { toast } from "react-toastify"
import { createCase, type CaseData } from "@/components/utils/api"
import { GetStates, GetLGAs, GetJudicialDivisions } from "@/Services/AuthRequest/auth.request"

interface UploadModalProps {
  onClose: () => void
  onSuccess?: () => void
}

interface StateOption {
  id: string
  label: string
  active: boolean
}

interface LgaOption {
  id: string
  label: string
  active: boolean
}

interface JudicialDivisionOption {
  id: string
  label: string
  active: boolean
}

export function UploadModal({ onClose, onSuccess }: UploadModalProps) {
  const [step, setStep] = useState<"options" | "form" | "success">("options")
  const [formStep, setFormStep] = useState(1) // Track form steps: 1 for property details, 2 for case details
  const [formData, setFormData] = useState<CaseData>({})
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

    // Map the input IDs to the correct field names
    switch (id) {
      // Step 1: Property Details
      case "propertyTitle":
        fieldName = "tile"
        break
      case "titleNumber":
        fieldName = "title_number"
        break
      case "surveyNumber":
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
      case "court":
        fieldName = "court_details"
        break
      case "commencementDate":
        fieldName = "date_of_commencement"
        break
      case "disposalDate":
        fieldName = "date_of_disposal"
        break
      case "natureDispute":
        fieldName = "nature_of_case"
        break
      case "status":
        fieldName = "status"
        break
    }

    setFormData((prev) => ({ ...prev, [fieldName]: value }))
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
        { field: "lga_id", label: "Local Government Area" },
        { field: "judicial_division_id", label: "Judicial Division" },
      ]

      for (const { field, label } of requiredStep1Fields) {
        if (!formData[field as keyof CaseData]) {
          setError(`${label} is required`)
          return
        }
      }

      // If validation passes, move to step 2
      setError(null)
      setFormStep(2)
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
      const response = await createCase(formData)
      console.log("Case created successfully:", response)
      toast.success("Case created successfully")
      setStep("success")
      
      // Call the onSuccess callback if provided
      if (onSuccess) {
        onSuccess()
      }
    } catch (error: any) {
      console.error("Error creating case:", error)
      setError(error.message || "Failed to create case. Please try again.")
      toast.error(error.message || "Failed to create case")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg overflow-hidden w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {step === "options" && (
          <>
            <div className="p-4 border-b border-gray-200 flex justify-center relative sticky top-0 bg-white z-10">
              <h2 className="text-lg font-semibold">Upload Case</h2>
              <button
                onClick={onClose}
                className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-8 flex flex-col gap-4 items-center">
              <button
                onClick={() => setStep("form")}
                className="w-full max-w-xs bg-blue-600 px-4 py-3 rounded text-white hover:bg-blue-700 transition-colors"
              >
                Upload Case Manually
              </button>

              <button
                className="w-full max-w-xs border border-gray-300 px-4 py-3 rounded text-gray-700 hover:bg-gray-50 transition-colors"
                onClick={() => toast.info("CSV upload functionality coming soon")}
              >
                Upload by CSV
              </button>

              <button
                className="w-full max-w-xs border border-gray-300 px-4 py-3 rounded text-gray-700 hover:bg-gray-50 transition-colors"
                onClick={() => toast.info("Download functionality coming soon")}
              >
                Download CSV Template
              </button>
            </div>
          </>
        )}

        {step === "form" && (
          <>
            <div className="p-4 border-b border-gray-200 flex justify-center relative sticky top-0 bg-white z-10">
              <h2 className="text-lg font-semibold">
                {formStep === 1 ? "Upload Case - Property Details" : "Upload Case - Case Details"}
              </h2>
              <button
                onClick={onClose}
                className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {error && (
              <div className="mx-6 mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start gap-2">
                <AlertCircle size={20} className="mt-0.5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

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
                      <label htmlFor="location" className="text-sm font-medium text-gray-700">
                        Location of Property <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="location"
                        type="text"
                        placeholder="House/Plot No, Street, Area"
                        value={formData.address || ""}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <label htmlFor="surveyNumber" className="text-sm font-medium text-gray-700">
                        Survey Plan Number
                      </label>
                      <input
                        id="surveyNumber"
                        type="text"
                        placeholder="Enter survey plan number"
                        value={formData.survey_plan_number || ""}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <label htmlFor="ownerName" className="text-sm font-medium text-gray-700">
                        Property Owner Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="ownerName"
                        type="text"
                        placeholder="Enter property owner name"
                        value={formData.owner_name || ""}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <label htmlFor="name_of_parties" className="text-sm font-medium text-gray-700">
                        Parties to the Suit/Claim <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="name_of_parties"
                        type="text"
                        placeholder="e.g. Party A vs Party B"
                        value={formData.name_of_parties || ""}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                          onClick={() => setStateDropdownOpen(!stateDropdownOpen)}
                          disabled={loadingStates}
                        >
                          <span>{formData.state || (loadingStates ? "Loading states..." : "Select state")}</span>
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
                              <div className="py-2 px-3 text-gray-500">No states available</div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* LGA Dropdown */}
                    <div className="space-y-1">
                      <label className="block text-sm font-medium text-gray-700">
                        Local Government Area <span className="text-red-500">*</span>
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
                            {lgas.length === 0 && !loadingLgas && formData.state_id && (
                              <div className="py-2 px-3 text-gray-500">No local governments available</div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Judicial Division Dropdown */}
                    <div className="space-y-1 md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Judicial Division <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <button
                          type="button"
                          className="w-full flex items-center justify-between px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-sm text-gray-700 hover:bg-gray-50"
                          onClick={() => setJudicialDivisionDropdownOpen(!judicialDivisionDropdownOpen)}
                          disabled={loadingJudicialDivisions}
                        >
                          <span>
                            {formData.judicial_division ||
                              (loadingJudicialDivisions ? "Loading judicial divisions..." : "Select judicial division")}
                          </span>
                          <ChevronDown className="h-4 w-4" />
                        </button>

                        {judicialDivisionDropdownOpen && (
                          <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-40 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                            {judicialDivisions.map((division) => (
                              <div
                                key={division.id}
                                className="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-gray-100"
                                onClick={() => handleJudicialDivisionSelect(division)}
                              >
                                {division.label}
                              </div>
                            ))}
                            {judicialDivisions.length === 0 && !loadingJudicialDivisions && (
                              <div className="py-2 px-3 text-gray-500">No judicial divisions available</div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Description of Properties */}
                    <div className="space-y-1 md:col-span-2">
                      <label htmlFor="descriptionOfProperties" className="block text-sm font-medium text-gray-700">
                        Description of Properties
                      </label>
                      <textarea
                        id="descriptionOfProperties"
                        placeholder="Enter detailed description of the properties involved"
                        value={formData.description_of_properties || ""}
                        onChange={(e) => setFormData({ ...formData, description_of_properties: e.target.value })}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        rows={3}
                      />
                    </div>
                  </div>
                ) : (
                  // Step 2: Case Details
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label htmlFor="suitNumber" className="text-sm font-medium text-gray-700">
                        Suit Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="suitNumber"
                        type="text"
                        placeholder="e.g. SN2023/001"
                        value={formData.suit_number || ""}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <label htmlFor="natureDispute" className="text-sm font-medium text-gray-700">
                        Nature of Dispute <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="natureDispute"
                        type="text"
                        placeholder="e.g. Land Dispute, Ownership"
                        value={formData.nature_of_case || ""}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <label htmlFor="court" className="text-sm font-medium text-gray-700">
                        Court and Judicial Division <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="court"
                        type="text"
                        placeholder="e.g. High Court Lagos"
                        value={formData.court_details || ""}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <label htmlFor="status" className="text-sm font-medium text-gray-700">
                        Status of Dispute <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="status"
                        type="text"
                        placeholder="ongoing / pending / concluded"
                        value={formData.status || ""}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <label htmlFor="commencementDate" className="text-sm font-medium text-gray-700">
                        Date of Commencement <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="commencementDate"
                        type="date"
                        value={formData.date_of_commencement || ""}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <label htmlFor="disposalDate" className="text-sm font-medium text-gray-700">
                        Date of Disposal
                      </label>
                      <input
                        id="disposalDate"
                        type="date"
                        value={formData.date_of_disposal || ""}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    
                    <div className="space-y-1 md:col-span-2">
                      <label htmlFor="subjectMatter" className="text-sm font-medium text-gray-700">
                        Subject Matter <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        id="subjectMatter"
                        placeholder="Enter the subject matter of the case"
                        value={formData.subject_matter || ""}
                        onChange={(e) => setFormData({ ...formData, subject_matter: e.target.value })}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        rows={3}
                        required
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 border-t border-gray-200 flex justify-end gap-3">
              {formStep === 1 ? (
                <>
                  <button
                    onClick={() => setStep("options")}
                    className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 transition-colors"
                    type="button"
                  >
                    Back
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
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <span>Submit</span>
                    )}
                  </button>
                </>
              )}
            </div>
          </>
        )}

        {step === "success" && (
          <div>
            <div className="p-4 border-b border-gray-200 flex justify-center relative sticky top-0 bg-white z-10">
              <h2 className="text-lg font-semibold">Case Created</h2>
              <button
                onClick={onClose}
                className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-8 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <Check className="h-8 w-8 text-green-600" />
              </div>

              <h3 className="text-xl font-semibold mb-2">Case Created Successfully</h3>
              <p className="text-gray-600 mb-6 max-w-md">
                The case has been successfully added to the system and is now available for viewing and management.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setFormData({})
                    setFormStep(1)
                    setStep("form")
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                  Add Another Case
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
