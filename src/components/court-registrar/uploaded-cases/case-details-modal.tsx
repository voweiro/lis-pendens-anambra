"use client";

import type React from "react";
import { useState } from "react";
import {
  ChevronDown,
  X,
  Trash2,
  Calendar,
  FileText,
  MapPin,
  User,
  Briefcase,
} from "lucide-react";
import { Button } from "@/components/utils/buttons";
import { UpdateCase, DeleteCase } from "@/Services/AuthRequest/auth.request";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

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
  description_of_properties?: string;
  subject_matter?: string;
  street?: string;
  city?: string;
  plot_number?: string;
  user_id?: string;
}

interface CaseDetailsModalProps {
  caseData: Case;
  onClose: () => void;
  onStatusChange: (id: string, newStatus: CaseStatus) => void;
  onCaseDeleted?: (id: string) => void;
}

export function CaseDetailsModal({
  caseData,
  onClose,
  onStatusChange,
  onCaseDeleted,
}: CaseDetailsModalProps) {
  // Log the received case data for debugging
  console.log('CaseDetailsModal received data:', caseData);
  console.log('Case data structure:', JSON.stringify(caseData, null, 2));
  console.log('Case ID type:', typeof caseData?.id);
  
  // Log specific fields that are showing as N/A
  console.log('title_number:', caseData?.title_number, typeof caseData?.title_number);
  console.log('survey_plan_number:', caseData?.survey_plan_number, typeof caseData?.survey_plan_number);
  console.log('parties:', caseData?.parties, typeof caseData?.parties);
  console.log('description_of_properties:', caseData?.description_of_properties, typeof caseData?.description_of_properties);
  console.log('subject_matter:', caseData?.subject_matter, typeof caseData?.subject_matter);
  
  // Force a refresh of the browser console to ensure we see the latest logs
  setTimeout(() => {
    console.log('---REFRESHED LOGS---');
    console.log('Checking case data again after delay:');
    console.log('parties:', caseData?.parties);
    console.log('description_of_properties:', caseData?.description_of_properties);
    console.log('subject_matter:', caseData?.subject_matter);
  }, 1000);
  const [isEditing, setIsEditing] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  // Force direct access to the case data to avoid any issues
  console.log('Direct access to case data fields:');
  console.log('parties direct:', caseData?.parties);
  console.log('description_of_properties direct:', caseData?.description_of_properties);
  console.log('subject_matter direct:', caseData?.subject_matter);
  
  // Create initial form data from case data - ensuring we directly access the fields
  const initialFormData = {
    title: caseData?.tile || caseData?.title || "", // Handle both 'tile' (API typo) and 'title'
    address: caseData?.address || "",
    status: caseData?.status || "ongoing",
    owner_name: caseData?.owner_name || "",
    title_number: caseData?.title_number?.toString() || "",
    survey_plan_number: caseData?.survey_plan_number?.toString() || "",
    parties: caseData?.parties || "",
    // Force direct access to the fields from the API response
    description_of_properties: caseData?.description_of_properties || "",
    subject_matter: caseData?.subject_matter || "",
    date_of_commencement: caseData?.date_of_commencement || "",
    suit_number: caseData?.suit_number || "",
    court_details: caseData?.court_details || "",
    date_of_disposal: caseData?.date_of_disposal || "",
    nature_of_case: caseData?.nature_of_case || "",
    state_id: caseData?.state_id || "",
    lga_id: caseData?.lga_id || "",
    judicial_division_id: caseData?.judicial_division_id || "",
  };
  
  // Log the initial form data to debug
  console.log('Initial form data:', initialFormData);
  console.log('parties in form data:', initialFormData.parties);
  console.log('description_of_properties in form data:', initialFormData.description_of_properties);
  console.log('subject_matter in form data:', initialFormData.subject_matter);
  
  const [formData, setFormData] = useState(initialFormData);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleStatusSelect = (status: CaseStatus) => {
    setFormData({
      ...formData,
      status,
    });
    onStatusChange(caseData.id, status);
    setShowStatusDropdown(false);
  };

  const handleSave = async () => {
    try {
      // Show loading state
      toast.info("Saving case details...");

      if (!caseData || !caseData.id) {
        toast.error("Cannot save: Invalid case data");
        return;
      }

      // Prepare data for API - ensure required fields are not null
      const dataToSend = {
        tile: formData.title || "", // Note the field name is 'tile' in the API
        title_number: formData.title_number || "", // Ensure not null
        address: formData.address || "",
        survey_plan_number: formData.survey_plan_number || "", // Ensure not null
        owner_name: formData.owner_name || "",
        suit_number: formData.suit_number || "",
        court_details: formData.court_details || "",
        parties: formData.parties || "", // Keep for backward compatibility
         // Use parties as fallback
        description_of_properties: formData.description_of_properties || "",
        subject_matter: formData.subject_matter || "",
        date_of_commencement: formData.date_of_commencement || "",
        nature_of_case: formData.nature_of_case || "",
        date_of_disposal: formData.date_of_disposal || "",
        status: formData.status || "pending", // Default status if not set
        judicial_division_id: formData.judicial_division_id || "",
        lga_id: formData.lga_id || "",
        state_id: formData.state_id || "",
      };

      console.log("Saving case with data:", dataToSend);

      // Call the API
      const response = await UpdateCase(caseData.id, dataToSend);
      console.log("Update response:", response);

      if (response && response.success) {
        toast.success("Case details updated successfully");
        if (typeof formData.status === 'string') {
          onStatusChange(caseData.id, formData.status as CaseStatus);
        }
        setIsEditing(false);
      } else {
        toast.error(response?.error || "Failed to update case details");
      }
    } catch (error) {
      console.error("Error saving case details:", error);
      toast.error("An error occurred while saving case details");
    }
  };

  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  const handleDelete = async () => {
    try {
      if (!caseData || !caseData.id) {
        toast.error("Cannot delete: Invalid case data");
        setIsDeleting(false);
        return;
      }
      
      setIsDeleting(true);
      toast.info("Deleting case...");

      console.log("Deleting case with ID:", caseData.id);
      const response = await DeleteCase(caseData.id);
      console.log("Delete response:", response);

      if (response && response.success) {
        toast.success("Case deleted successfully");
        onClose();

        // Notify parent component that case was deleted
        if (onCaseDeleted) {
          onCaseDeleted(caseData.id);
        }

        // Reload the page after successful deletion
        setTimeout(() => {
          window.location.reload();
        }, 1500); // Wait 1.5 seconds to allow the toast to be visible
      } else {
        setIsDeleting(false);
        toast.error(response?.error || "Failed to delete case");
      }
    } catch (error) {
      setIsDeleting(false);
      console.error("Error deleting case:", error);
      toast.error("An error occurred while deleting the case");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-auto shadow-2xl transform transition-all duration-300 ease-in-out">
        <div className="p-5 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white z-10 bg-gradient-to-r from-green-50 to-white rounded-t-xl">
          <h2 className="text-xl font-bold text-gray-800 flex items-center">
            <span className="bg-green-100 text-green-700 p-2 rounded-full mr-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                  clipRule="evenodd"
                />
              </svg>
            </span>
            Case Details
          </h2>
          <button
            onClick={onClose}
            className="bg-gray-100 hover:bg-gray-200 text-gray-600 p-2 rounded-full transition-colors duration-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 bg-gradient-to-b from-white to-gray-50">
          <div className="mb-6 flex justify-between items-center">
            <div className="flex items-center">
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  formData.status === "pending"
                    ? "bg-yellow-100 text-yellow-800"
                    : formData.status === "ongoing"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-green-100 text-green-800"
                }`}
              >
                {formData.status && typeof formData.status === 'string' 
                  ? formData.status.charAt(0).toUpperCase() + formData.status.slice(1)
                  : "Unknown"}
              </span>
              <span className="ml-3 text-gray-500 text-sm">
                ID:{" "}
                {caseData && caseData.id ? 
                  (typeof caseData.id === "string"
                    ? `${caseData.id.substring(0, 8)}...`
                    : caseData.id)
                  : "N/A"}
              </span>
            </div>
            <div className="flex space-x-3">
              {isEditing ? (
                <button
                  onClick={handleSave}
                  className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-md shadow-sm transition-colors duration-200"
                >
                  Save Changes
                </button>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="inline-flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-md shadow-sm transition-colors duration-200"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                  Edit
                </button>
              )}
              <button
                onClick={() => setShowDeleteConfirmation(true)}
                className="inline-flex items-center px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 text-sm font-medium rounded-md shadow-sm transition-colors duration-200"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            {/* Property Title */}
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1 text-gray-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                    clipRule="evenodd"
                  />
                </svg>
                Property Title
              </h3>
              {isEditing ? (
                <input
                  type="text"
                  name="title"
                  value={formData.title || ""}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter property title"
                />
              ) : (
                <p className="text-gray-900 font-medium py-1.5">
                  {formData.title || "N/A"}
                </p>
              )}
            </div>

            {/* Location/Address */}
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1 text-gray-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                    clipRule="evenodd"
                  />
                </svg>
                Location/Address
              </h3>
              {isEditing ? (
                <input
                  type="text"
                  name="address"
                  value={formData.address || ""}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter property address"
                />
              ) : (
                <p className="text-gray-900 font-medium py-1.5">
                  {formData.address || "N/A"}
                </p>
              )}
            </div>

            {/* Status */}
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Status</h3>
              {isEditing ? (
                <div className="relative">
                  <button
                    type="button"
                    className="w-full flex items-center justify-between border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-gray-200"
                    onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                  >
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                        formData.status === "ongoing"
                          ? "bg-red-50 text-red-700"
                          : formData.status === "pending"
                          ? "bg-yellow-50 text-yellow-700"
                          : "bg-green-50 text-green-700"
                      }`}
                    >
                      {formData.status.charAt(0).toUpperCase() +
                        formData.status.slice(1)}
                    </span>
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                  </button>

                  {showStatusDropdown && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded shadow-lg">
                      <button
                        type="button"
                        className="w-full text-left px-4 py-2 hover:bg-gray-100"
                        onClick={() => handleStatusSelect("ongoing")}
                      >
                        <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700">
                          Ongoing
                        </span>
                      </button>
                      <button
                        type="button"
                        className="w-full text-left px-4 py-2 hover:bg-gray-100"
                        onClick={() => handleStatusSelect("pending")}
                      >
                        <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-yellow-50 text-yellow-700">
                          Pending
                        </span>
                      </button>
                      <button
                        type="button"
                        className="w-full text-left px-4 py-2 hover:bg-gray-100"
                        onClick={() => handleStatusSelect("concluded")}
                      >
                        <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700">
                          Concluded
                        </span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <p
                  className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                    formData.status === "ongoing"
                      ? "bg-red-50 text-red-700"
                      : formData.status === "pending"
                      ? "bg-yellow-50 text-yellow-700"
                      : "bg-green-50 text-green-700"
                  }`}
                >
                  {formData.status.charAt(0).toUpperCase() +
                    formData.status.slice(1)}
                </p>
              )}
            </div>

            {/* Property Owner */}
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">
                Property Owner
              </h3>
              {isEditing ? (
                <input
                  type="text"
                  name="owner_name"
                  value={formData.owner_name || ""}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-gray-200"
                />
              ) : (
                <p className="text-gray-900">{formData.owner_name || "N/A"}</p>
              )}
            </div>

            {/* Registered Title Number */}
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">
                Registered Title Number
              </h3>
              {isEditing ? (
                <input
                  type="text"
                  name="title_number"
                  value={formData.title_number || ""}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-gray-200"
                />
              ) : (
                <p className="text-gray-900">
                  {formData.title_number !== "" ? formData.title_number : "N/A"}
                </p>
              )}
            </div>

            {/* Survey Plan Number */}
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">
                Survey Plan Number
              </h3>
              {isEditing ? (
                <input
                  type="text"
                  name="survey_plan_number"
                  value={formData.survey_plan_number || ""}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-gray-200"
                />
              ) : (
                <p className="text-gray-900">
                  {formData.survey_plan_number !== "" ? formData.survey_plan_number : "N/A"}
                </p>
              )}
            </div>

            {/* State ID */}
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">
                State ID
              </h3>
              {isEditing ? (
                <input
                  type="text"
                  name="state_id"
                  value={formData.state_id || ""}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-gray-200"
                />
              ) : (
                <p className="text-gray-900">{formData.state_id || "N/A"}</p>
              )}
            </div>

            {/* LGA ID */}
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">LGA ID</h3>
              {isEditing ? (
                <input
                  type="text"
                  name="lga_id"
                  value={formData.lga_id || ""}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-gray-200"
                />
              ) : (
                <p className="text-gray-900">{formData.lga_id || "N/A"}</p>
              )}
            </div>

            {/* Judicial Division ID */}
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">
                Judicial Division ID
              </h3>
              {isEditing ? (
                <input
                  type="text"
                  name="judicial_division_id"
                  value={formData.judicial_division_id || ""}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-gray-200"
                />
              ) : (
                <p className="text-gray-900">
                  {formData.judicial_division_id || "N/A"}
                </p>
              )}
            </div>

            {/* Parties to the Suit/Claim */}
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">
                Parties to the Suit/Claim
              </h3>
              {isEditing ? (
                <input
                  type="text"
                  name="parties"
                  value={formData.parties || ""}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-gray-200"
                />
              ) : (
                <p className="text-gray-900">{formData.parties !== "" ? formData.parties : "N/A"}</p>
              )}
            </div>

            {/* Suit Number */}
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">
                Suit Number
              </h3>
              {isEditing ? (
                <input
                  type="text"
                  name="suit_number"
                  value={formData.suit_number || ""}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-gray-200"
                />
              ) : (
                <p className="text-gray-900">{formData.suit_number || "N/A"}</p>
              )}
            </div>

            {/* Court Details */}
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">
                Court Details
              </h3>
              {isEditing ? (
                <input
                  type="text"
                  name="court_details"
                  value={formData.court_details || ""}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-gray-200"
                />
              ) : (
                <p className="text-gray-900">
                  {formData.court_details || "N/A"}
                </p>
              )}
            </div>

            {/* Date of Commencement */}
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">
                Date of Commencement
              </h3>
              {isEditing ? (
                <input
                  type="date"
                  name="date_of_commencement"
                  value={formData.date_of_commencement || ""}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-gray-200"
                />
              ) : (
                <p className="text-gray-900">
                  {formData.date_of_commencement || "N/A"}
                </p>
              )}
            </div>

            {/* Date of Disposal */}
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">
                Date of Disposal
              </h3>
              {isEditing ? (
                <input
                  type="date"
                  name="date_of_disposal"
                  value={formData.date_of_disposal || ""}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-gray-200"
                />
              ) : (
                <p className="text-gray-900">
                  {formData.date_of_disposal || "N/A"}
                </p>
              )}
            </div>

            {/* Nature of Case */}
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">
                Nature of Case
              </h3>
              {isEditing ? (
                <textarea
                  name="nature_of_case"
                  value={formData.nature_of_case || ""}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-gray-200"
                  rows={3}
                ></textarea>
              ) : (
                <p className="text-gray-900">
                  {formData.nature_of_case || "N/A"}
                </p>
              )}
            </div>
          </div>

          {/* Additional fields section */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2 text-green-600"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M5 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4zM11 4a1 1 0 10-2 0v1.268a2 2 0 000 3.464V16a1 1 0 102 0V8.732a2 2 0 000-3.464V4zM16 3a1 1 0 011 1v7.268a2 2 0 010 3.464V16a1 1 0 11-2 0v-1.268a2 2 0 010-3.464V4a1 1 0 011-1z" />
              </svg>
              Additional Case Information
            </h3>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Description of Properties */}
              <div className="md:col-span-2">
                <h3 className="text-sm font-medium text-gray-500 mb-1 flex items-center">
                  <FileText className="h-4 w-4 mr-1 text-gray-400" />
                  Description of Properties
                  {!isEditing && !caseData?.description_of_properties && (
                    <span className="ml-2 text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">New field</span>
                  )}
                </h3>
                {isEditing ? (
                  <textarea
                    name="description_of_properties"
                    value={formData.description_of_properties || ""}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter description of properties"
                    rows={3}
                  />
                ) : (
                  <div>
                    {/* Direct rendering from API response */}
                    <div className="bg-green-50 p-3 rounded-lg mb-2">
                      <p className="text-gray-900 font-medium">
                        {typeof caseData?.description_of_properties === 'string' ? caseData.description_of_properties : 'N/A'}
                      </p>
                    </div>
                    
                    {/* Fallback to form data if needed */}
                    {!caseData?.description_of_properties && formData.description_of_properties && (
                      <p className="text-gray-900 font-medium py-1.5">
                        {formData.description_of_properties}
                      </p>
                    )}
                    
                    {/* Show helper text if both are empty */}
                    {!caseData?.description_of_properties && !formData.description_of_properties && (
                      <p className="text-gray-500 italic">
                        (Edit to add this information)
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Subject Matter */}
              <div className="md:col-span-2">
                <h3 className="text-sm font-medium text-gray-500 mb-1 flex items-center">
                  <Briefcase className="h-4 w-4 mr-1 text-gray-400" />
                  Subject Matter
                  {!isEditing && !caseData?.subject_matter && (
                    <span className="ml-2 text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">New field</span>
                  )}
                </h3>
                {isEditing ? (
                  <textarea
                    name="subject_matter"
                    value={formData.subject_matter || ""}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter subject matter"
                    rows={3}
                  />
                ) : (
                  <div>
                    {/* Direct rendering from API response */}
                    <div className="bg-green-50 p-3 rounded-lg mb-2">
                      <p className="text-gray-900 font-medium">
                        {typeof caseData?.subject_matter === 'string' ? caseData.subject_matter : 'N/A'}
                      </p>
                    </div>
                    
                    {/* Fallback to form data if needed */}
                    {!caseData?.subject_matter && formData.subject_matter && (
                      <p className="text-gray-900 font-medium py-1.5">
                        {formData.subject_matter}
                      </p>
                    )}
                    
                    {/* Show helper text if both are empty */}
                    {!caseData?.subject_matter && !formData.subject_matter && (
                      <p className="text-gray-500 italic">
                        (Edit to add this information)
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Owner Name */}
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  Owner Name
                </h3>
                {isEditing ? (
                  <input
                    type="text"
                    name="owner_name"
                    value={formData.owner_name || ""}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter owner name"
                  />
                ) : (
                  <p className="text-gray-900 font-medium py-1.5">
                    {formData.owner_name || "N/A"}
                  </p>
                )}
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  Suit Number
                </h3>
                {isEditing ? (
                  <input
                    type="text"
                    name="suit_number"
                    value={formData.suit_number || ""}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter suit number"
                  />
                ) : (
                  <p className="text-gray-900 font-medium py-1.5">
                    {formData.suit_number || "N/A"}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="p-5 border-t border-gray-200 flex justify-between items-center sticky bottom-0 bg-white z-10 bg-gradient-to-r from-white to-green-50 rounded-b-xl">
          {isEditing ? (
            <div className="flex space-x-3">
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200 flex items-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center shadow-sm"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                Save Changes
              </button>
            </div>
          ) : null}

          <div className="relative ml-auto">
            <button
              onClick={() => setShowStatusDropdown(!showStatusDropdown)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors duration-200 ${
                formData.status === "pending"
                  ? "bg-yellow-50 text-yellow-700 hover:bg-yellow-100"
                  : formData.status === "ongoing"
                  ? "bg-blue-50 text-blue-700 hover:bg-blue-100"
                  : "bg-green-50 text-green-700 hover:bg-green-100"
              }`}
            >
              <span className="font-medium">
                Status:{" "}
                {formData.status && typeof formData.status === 'string' 
                  ? formData.status.charAt(0).toUpperCase() + formData.status.slice(1)
                  : "Unknown"}
              </span>
              <ChevronDown className="h-4 w-4" />
            </button>

            {showStatusDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-20 border border-gray-100 overflow-hidden">
                <div className="py-1">
                  <button
                    className="block w-full text-left px-4 py-2.5 text-sm text-yellow-700 hover:bg-yellow-50 transition-colors duration-200 font-medium"
                    onClick={() => handleStatusSelect("pending")}
                  >
                    Pending
                  </button>
                  <button
                    className="block w-full text-left px-4 py-2.5 text-sm text-blue-700 hover:bg-blue-50 transition-colors duration-200 font-medium"
                    onClick={() => handleStatusSelect("ongoing")}
                  >
                    Ongoing
                  </button>
                  <button
                    className="block w-full text-left px-4 py-2.5 text-sm text-green-700 hover:bg-green-50 transition-colors duration-200 font-medium"
                    onClick={() => handleStatusSelect("concluded")}
                  >
                    Concluded
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirmation && (
        <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Confirm Delete
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this case? This action cannot be
              undone.
            </p>
            <div className="flex justify-end space-x-3">
              <Button
                onClick={() => setShowDeleteConfirmation(false)}
                variant="outline"
                className="border border-gray-300 px-4 py-2 rounded-md"
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button
                onClick={handleDelete}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md flex items-center"
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: CaseStatus }) {
  if (status === "ongoing") {
    return (
      <div className="inline-flex items-center">
        <span className="px-3 py-1 text-sm rounded-full border border-orange-300 text-orange-600">
          Ongoing
        </span>
      </div>
    );
  }

  if (status === "concluded") {
    return (
      <div className="inline-flex items-center">
        <span className="px-3 py-1 text-sm rounded-full border border-green-300 text-green-600">
          Concluded
        </span>
      </div>
    );
  }

  return (
    <div className="inline-flex items-center">
      <span className="px-3 py-1 text-sm rounded-full border border-blue-300 text-blue-600">
        Pending
      </span>
    </div>
  );
}
