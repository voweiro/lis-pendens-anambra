"use client";

import { X } from "lucide-react";
import { CaseData } from "@/components/utils/api";

interface CaseDetailsViewProps {
  caseData: any;
  onClose: () => void;
}

export function CaseDetailsView({ caseData, onClose }: CaseDetailsViewProps) {
  // Format date for display
  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  // Helper function to format a field label
  const formatLabel = (label: string) => {
    return label
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white z-10">
          <h2 className="text-lg font-semibold">Case Details</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Property Details Section */}
            <div className="col-span-2">
              <h3 className="text-lg font-medium text-gray-900 mb-4 pb-2 border-b border-gray-200">
                Property Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Property Title
                  </p>
                  <p className="mt-1">{caseData.tile || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Title Number
                  </p>
                  <p className="mt-1">{caseData.title_number || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Survey Plan Number
                  </p>
                  <p className="mt-1">{caseData.survey_plan_number || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Property Owner
                  </p>
                  <p className="mt-1">{caseData.owner_name || "N/A"}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm font-medium text-gray-500">Location</p>
                  <p className="mt-1">{caseData.address || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">State</p>
                  <p className="mt-1">
                    {caseData.state || caseData.state_id || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">LGA</p>
                  <p className="mt-1">{caseData.lga_id || "N/A"}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm font-medium text-gray-500">
                    Parties Involved
                  </p>
                  <p className="mt-1">{caseData.parties || "N/A"}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm font-medium text-gray-500">
                    Description of Properties
                  </p>
                  <p className="mt-1">
                    {caseData.description_of_properties || "N/A"}
                  </p>
                </div>
              </div>
            </div>

            {/* Case Details Section */}
            <div className="col-span-2">
              <h3 className="text-lg font-medium text-gray-900 mb-4 pb-2 border-b border-gray-200">
                Case Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Suit Number
                  </p>
                  <p className="mt-1">{caseData.suit_number || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Nature of Dispute
                  </p>
                  <p className="mt-1">{caseData.nature_of_case || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Court Details
                  </p>
                  <p className="mt-1">{caseData.court_details || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Judicial Division
                  </p>
                  <p className="mt-1">
                    {caseData.judicial_division_id || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Status</p>
                  <p className="mt-1">
                    <span
                      className={`px-2 py-1 text-xs rounded-full 
                      ${
                        caseData.status?.toLowerCase() === "ongoing"
                          ? "bg-yellow-100 text-yellow-800"
                          : caseData.status?.toLowerCase() === "concluded"
                          ? "bg-green-100 text-green-800"
                          : caseData.status?.toLowerCase() === "disposed"
                          ? "bg-green-100 text-green-800"
                          : caseData.status?.toLowerCase() === "on appeal"
                          ? "bg-red-100 text-red-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {caseData.status || "N/A"}
                    </span>
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Date of Commencement
                  </p>
                  <p className="mt-1">
                    {formatDate(caseData.date_of_commencement)}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Date of Disposal
                  </p>
                  <p className="mt-1">
                    {formatDate(caseData.date_of_disposal)}
                  </p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm font-medium text-gray-500">
                    Subject Matter
                  </p>
                  <p className="mt-1">{caseData.subject_matter || "N/A"}</p>
                </div>
              </div>
            </div>

            {/* System Details Section */}
            <div className="col-span-2">
              <h3 className="text-lg font-medium text-gray-900 mb-4 pb-2 border-b border-gray-200">
                System Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Case ID</p>
                  <p className="mt-1">{caseData.id || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Created At
                  </p>
                  <p className="mt-1">{formatDate(caseData.created_at)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Last Updated
                  </p>
                  <p className="mt-1">{formatDate(caseData.updated_at)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-gray-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
